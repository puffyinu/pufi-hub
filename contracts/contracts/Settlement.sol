// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IAllowanceTransfer} from "./interfaces/IAllowanceTransfer.sol";

/**
 * @title Settlement
 * @notice Handles the settlement of campaign funds by splitting the budget between platform and reward wallets.
 */
contract Settlement is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable platformWallet;
    address public immutable rewardWallet;
    IAllowanceTransfer public immutable permit2;

    mapping(bytes32 => bool) public settledCampaigns;

    event CampaignSettled(
        string indexed campaignId,
        address indexed advertiser,
        address indexed token,
        uint256 campaignBudget,
        uint256 platformFee,
        uint256 rewardPool
    );
    event PlatformFeeTransferred(address indexed platformWallet, address indexed token, uint256 amount);
    event RewardPoolFunded(address indexed rewardWallet, address indexed token, uint256 amount);

    error ZeroAddress();
    error InvalidBudget();
    error CampaignAlreadySettled();
    error TransferFailed();
    error InvalidAdvertiser();
    error InvalidToken();

    constructor(
        address _platformWallet,
        address _rewardWallet,
        address _permit2
    ) {
        if (
            _platformWallet == address(0) ||
            _rewardWallet == address(0) ||
            _permit2 == address(0)
        ) {
            revert ZeroAddress();
        }

        platformWallet = _platformWallet;
        rewardWallet = _rewardWallet;
        permit2 = IAllowanceTransfer(_permit2);
    }

    /**
     * @notice Settles a campaign by transferring budget from advertiser and splitting it.
     */
    function settleCampaign(
        string calldata campaignId,
        address token,
        uint256 campaignBudget,
        address advertiser
    ) external nonReentrant {
        if (
            campaignBudget == 0 ||
            campaignBudget > type(uint160).max
        ) revert InvalidBudget();
        if (advertiser == address(0)) revert InvalidAdvertiser();
        if (token == address(0)) revert InvalidToken();

        bytes32 campaignKey = keccak256(bytes(campaignId));
        if (settledCampaigns[campaignKey]) revert CampaignAlreadySettled();

        // Mark as settled before interaction (Checks-Effects-Interactions)
        settledCampaigns[campaignKey] = true;

        // 1. Pull budget from advertiser through Permit2.
        permit2.transferFrom(
            advertiser,
            address(this),
            uint160(campaignBudget),
            token
        );

        // 2. Calculate split (30% platform, 70% reward)
        uint256 platformFee = (campaignBudget * 30) / 100;
        uint256 rewardPool = campaignBudget - platformFee;

        // 3. Disburse funds
        IERC20(token).safeTransfer(platformWallet, platformFee);
        IERC20(token).safeTransfer(rewardWallet, rewardPool);

        // 4. Emit events
        emit CampaignSettled(campaignId, advertiser, token, campaignBudget, platformFee, rewardPool);
        emit PlatformFeeTransferred(platformWallet, token, platformFee);
        emit RewardPoolFunded(rewardWallet, token, rewardPool);
    }
}
