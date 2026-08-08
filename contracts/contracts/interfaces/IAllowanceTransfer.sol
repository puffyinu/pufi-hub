// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAllowanceTransfer
/// @notice Minimal Permit2 AllowanceTransfer interface required by PUFI HUB.
/// @dev Compatible with Uniswap Permit2's AllowanceTransfer entrypoints.
interface IAllowanceTransfer {
    function transferFrom(
        address from,
        address to,
        uint160 amount,
        address token
    ) external;
}
