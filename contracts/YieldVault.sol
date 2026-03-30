// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldVault
 * @dev Implementation of an ERC-4626 vault for Farsi with simulated yield.
 * Allows users to deposit USDC (or equivalent) to earn yield.
 * Yield is simulated via a time-based bonus on totalAssets().
 */
contract YieldVault is ERC4626, Ownable, ReentrancyGuard {
    uint256 public deployTimestamp;
    
    /// @dev Annual yield rate in basis points (450 = 4.5%)
    uint256 public annualYieldBps = 450;
    
    /// @dev Bonus yield injected by owner for demo purposes
    uint256 public bonusYield;

    event YieldInjected(uint256 amount, uint256 totalBonus);
    event YieldRateUpdated(uint256 newRateBps);

    constructor(IERC20 asset, string memory name, string memory symbol) 
        ERC4626(asset) 
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        deployTimestamp = block.timestamp;
    }

    /**
     * @dev Deposit tokens and receive shares.
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
     * @dev Returns total assets including simulated time-based yield.
     * Combines real balance + time-based yield + any bonus injected by owner.
     * In production, this would come from a real lending protocol.
     */
    function totalAssets() public view override returns (uint256) {
        uint256 realBalance = super.totalAssets();
        if (realBalance == 0) return bonusYield;
        
        // Calculate time-based simulated yield
        uint256 elapsed = block.timestamp - deployTimestamp;
        // yield = balance * rate * elapsed / (365 days * 10000)
        uint256 simulatedYield = (realBalance * annualYieldBps * elapsed) / (365 days * 10000);
        
        return realBalance + simulatedYield + bonusYield;
    }

    /**
     * @dev Owner can inject bonus yield for demo purposes.
     * This simulates protocol revenue being distributed to the vault.
     */
    function injectYield(uint256 amount) external onlyOwner {
        bonusYield += amount;
        emit YieldInjected(amount, bonusYield);
    }

    /**
     * @dev Owner can update the annual yield rate (in basis points).
     */
    function setYieldRate(uint256 newRateBps) external onlyOwner {
        require(newRateBps <= 5000, "Rate too high"); // Max 50%
        annualYieldBps = newRateBps;
        emit YieldRateUpdated(newRateBps);
    }

    /**
     * @dev View helper: get current simulated APY in basis points.
     */
    function getCurrentAPY() external view returns (uint256) {
        return annualYieldBps;
    }
}
