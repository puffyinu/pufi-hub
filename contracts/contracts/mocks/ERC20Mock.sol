// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20Mock
 * @dev Mock implementation of ERC20 for testing purposes.
 */
contract ERC20Mock is ERC20 {
    constructor(uint256 initialSupply) ERC20("MockToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
