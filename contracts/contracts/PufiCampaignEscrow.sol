// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PufiCampaignEscrow
/// @notice Escrows advertiser campaign budgets and releases per-claim rewards
///         to users on behalf of PUFI HUB. See docs/smart-contracts/campaign-escrow-spec-v1.md
///         for the full product specification and rationale behind each design decision.
/// @dev Deliberately has NO cancel/refund/withdraw-by-advertiser functions.
///      Once a campaign's pool is funded, it is locked until fully released
///      via `releaseReward`, per the PUFI HUB business rules (Phase 1 spec, Section 2).
contract PufiCampaignEscrow is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Address allowed to call `releaseReward`. This is a dedicated
    ///         hot wallet, separate from both the Daily Claim reward wallet
    ///         and the Owner wallet (see spec Section 5).
    address public operator;

    /// @notice Address that receives the platform fee portion (30%) at
    ///         campaign creation. Typically a wallet held manually, not a
    ///         server-controlled hot wallet.
    address public platformFeeWallet;

    /// @notice campaignId => token => amount still locked in escrow for that campaign.
    mapping(bytes32 => mapping(address => uint256)) public campaignBalance;

    /// @notice campaignId => whether it has already been created (prevents re-use).
    mapping(bytes32 => bool) public campaignExists;

    event CampaignCreated(
        bytes32 indexed campaignId,
        address indexed advertiser,
        address indexed token,
        uint256 poolAmount,
        uint256 feeAmount
    );

    event RewardReleased(
        bytes32 indexed campaignId,
        address indexed to,
        address indexed token,
        uint256 amount
    );

    event OperatorUpdated(address indexed previousOperator, address indexed newOperator);
    event PlatformFeeWalletUpdated(address indexed previousWallet, address indexed newWallet);

    error CampaignAlreadyExists(bytes32 campaignId);
    error CampaignDoesNotExist(bytes32 campaignId);
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientCampaignBalance(bytes32 campaignId, uint256 requested, uint256 available);
    error NotOperator(address caller);

    modifier onlyOperator() {
        if (msg.sender != operator) revert NotOperator(msg.sender);
        _;
    }

    /// @param initialOwner Address that can update `operator` and `platformFeeWallet`.
    ///        Recommended: a manually-held wallet, distinct from `initialOperator`.
    /// @param initialOperator Address authorized to call `releaseReward`.
    ///        Recommended: a dedicated server wallet, distinct from the Daily
    ///        Claim reward wallet (see spec Section 5 for the rationale).
    /// @param initialPlatformFeeWallet Address that receives the 30% platform
    ///        fee on every `createCampaign` call.
    constructor(
        address initialOwner,
        address initialOperator,
        address initialPlatformFeeWallet
    ) Ownable(initialOwner) {
        if (initialOperator == address(0)) revert ZeroAddress();
        if (initialPlatformFeeWallet == address(0)) revert ZeroAddress();

        operator = initialOperator;
        platformFeeWallet = initialPlatformFeeWallet;
    }

    /// @notice Called by an advertiser (after approving this contract for
    ///         `poolAmount + feeAmount`) to fund a new campaign in one
    ///         transaction. `poolAmount` is locked in escrow under
    ///         `campaignId`; `feeAmount` is forwarded immediately to
    ///         `platformFeeWallet`.
    /// @dev The 70/30 split itself is computed off-chain (backend/frontend)
    ///      before calling this function — this contract only ever sees two
    ///      final numbers, per spec Section 2/4.
    /// @param campaignId Unique identifier for the campaign. Should match the
    ///        corresponding campaign UUID in the PUFI HUB Supabase database
    ///        (e.g. keccak256 of the UUID string).
    /// @param token ERC20 token contract used for this campaign's rewards.
    /// @param poolAmount Amount locked in escrow, available for `releaseReward`.
    /// @param feeAmount Amount sent directly to `platformFeeWallet`.
    function createCampaign(
        bytes32 campaignId,
        address token,
        uint256 poolAmount,
        uint256 feeAmount
    ) external nonReentrant {
        if (campaignExists[campaignId]) revert CampaignAlreadyExists(campaignId);
        if (token == address(0)) revert ZeroAddress();
        if (poolAmount == 0 || feeAmount == 0) revert ZeroAmount();

        campaignExists[campaignId] = true;
        campaignBalance[campaignId][token] += poolAmount;

        IERC20 erc20 = IERC20(token);

        // Pull the full amount (pool + fee) from the advertiser in one transfer.
        erc20.safeTransferFrom(msg.sender, address(this), poolAmount + feeAmount);

        // Forward the platform fee immediately; it never sits in this contract.
        erc20.safeTransfer(platformFeeWallet, feeAmount);

        emit CampaignCreated(campaignId, msg.sender, token, poolAmount, feeAmount);
    }

    /// @notice Called by the Operator to pay out an accumulated reward to a
    ///         user, drawing from the specific campaign's locked balance.
    /// @dev Reverts automatically if `amount` exceeds what remains locked
    ///      for this campaign — this is the contract's core over-payout
    ///      protection and requires no additional manual bookkeeping.
    /// @param campaignId The campaign whose escrowed balance funds this payout.
    /// @param token ERC20 token to release (must match the token the
    ///        campaign was funded with).
    /// @param to Recipient wallet (the user claiming their reward).
    /// @param amount Amount to release.
    function releaseReward(
        bytes32 campaignId,
        address token,
        address to,
        uint256 amount
    ) external onlyOperator nonReentrant {
        if (!campaignExists[campaignId]) revert CampaignDoesNotExist(campaignId);
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        uint256 available = campaignBalance[campaignId][token];
        if (amount > available) {
            revert InsufficientCampaignBalance(campaignId, amount, available);
        }

        campaignBalance[campaignId][token] = available - amount;

        IERC20(token).safeTransfer(to, amount);

        emit RewardReleased(campaignId, to, token, amount);
    }

    /// @notice Returns the amount of `token` still locked in escrow for `campaignId`.
    function getCampaignBalance(bytes32 campaignId, address token) external view returns (uint256) {
        return campaignBalance[campaignId][token];
    }

    /// @notice Updates the Operator address. Only callable by Owner.
    /// @dev Use this to rotate the operator hot wallet's key without
    ///      redeploying the contract or losing any escrowed funds.
    function setOperator(address newOperator) external onlyOwner {
        if (newOperator == address(0)) revert ZeroAddress();
        address previous = operator;
        operator = newOperator;
        emit OperatorUpdated(previous, newOperator);
    }

    /// @notice Updates the platform fee recipient address. Only callable by Owner.
    function setPlatformFeeWallet(address newWallet) external onlyOwner {
        if (newWallet == address(0)) revert ZeroAddress();
        address previous = platformFeeWallet;
        platformFeeWallet = newWallet;
        emit PlatformFeeWalletUpdated(previous, newWallet);
    }
}