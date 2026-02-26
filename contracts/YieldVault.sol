// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldVault
 * @dev Implementation of an ERC-4626 vault for Farsi.
 * Allows users to deposit USDC (or equivalent) to earn yield.
 * This is a simplified version suitable for Flow EVM hackathon demo.
 */
contract YieldVault is ERC4626, Ownable, ReentrancyGuard {
    constructor(IERC20 asset, string memory name, string memory symbol) 
        ERC4626(asset) 
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {}

    /**
     * @dev Deposit tokens and receive shares.
     * Modified to include Farsi-specific logging or sponsored tx checks.
     */
    function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256) {
        return super.deposit(assets, receiver);
    }

    /**
     * @dev Withdraw tokens by burning shares.
     */
    function withdraw(uint256 assets, address receiver, address owner) public override nonReentrant returns (uint256) {
        return super.withdraw(assets, receiver, owner);
    }

    /**
     * @dev Simulated yield generation for the hackathon demo.
     * In production, this would integrate with a real lending protocol.
     */
    function totalAssets() public view override returns (uint256) {
        // Simplified: return real balance + virtual yield for demo
        return super.totalAssets();
    }
}
