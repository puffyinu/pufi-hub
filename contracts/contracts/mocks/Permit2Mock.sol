// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Permit2Mock
/// @notice Minimal local test double for Permit2 AllowanceTransfer.
/// @dev This is TEST-ONLY infrastructure. It is not a Permit2 implementation.
contract Permit2Mock {
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => mapping(address => uint256)))
        public allowance;

    error InsufficientAllowance(
        address owner,
        address token,
        address spender,
        uint256 requested,
        uint256 available
    );

    function approve(
        address token,
        address spender,
        uint160 amount,
        uint48
    ) external {
        allowance[msg.sender][token][spender] = amount;
    }

    function transferFrom(
        address from,
        address to,
        uint160 amount,
        address token
    ) external {
        uint256 available = allowance[from][token][msg.sender];

        if (amount > available) {
            revert InsufficientAllowance(
                from,
                token,
                msg.sender,
                amount,
                available
            );
        }

        allowance[from][token][msg.sender] = available - amount;

        IERC20(token).safeTransferFrom(from, to, amount);
    }
}
