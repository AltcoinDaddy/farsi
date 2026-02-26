// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SharedPot
 * @dev A collaborative pot where friends can save together using ERC20 tokens.
 */
contract SharedPot is ReentrancyGuard {
    string public name;
    uint256 public targetAmount;
    address[] public contributors;
    mapping(address => uint256) public balances;
    address public creator;
    IERC20 public asset;

    event Contributed(address indexed user, uint256 amount);

    constructor(
        string memory _name,
        uint256 _target,
        address _creator,
        IERC20 _asset
    ) {
        name = _name;
        targetAmount = _target;
        creator = _creator;
        asset = _asset;
    }

    function contribute(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        // Transfer mUSDC from user to this pot
        asset.transferFrom(msg.sender, address(this), amount);

        if (balances[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        balances[msg.sender] += amount;
        emit Contributed(msg.sender, amount);
    }

    function totalContributed() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function getContributorsCount() external view returns (uint256) {
        return contributors.length;
    }

    /**
     * @dev Only creator can withdraw once target is met.
     */
    function withdraw() external nonReentrant {
        require(msg.sender == creator, "Only creator");
        uint256 balance = asset.balanceOf(address(this));
        require(balance >= targetAmount, "Target not met");

        asset.transfer(creator, balance);
    }
}

/**
 * @title SharedPotFactory
 * @dev Factory to create new SharedPots on Flow EVM.
 */
contract SharedPotFactory is Ownable {
    SharedPot[] public pots;
    address public usdcAddress;

    event PotCreated(address indexed potAddress, string name, uint256 target);

    constructor(address _usdcAddress) Ownable(msg.sender) {
        usdcAddress = _usdcAddress;
    }

    function createPot(
        string memory name,
        uint256 target
    ) external returns (address) {
        SharedPot newPot = new SharedPot(
            name,
            target,
            msg.sender,
            IERC20(usdcAddress)
        );
        pots.push(newPot);
        emit PotCreated(address(newPot), name, target);
        return address(newPot);
    }

    function getPots() external view returns (SharedPot[] memory) {
        return pots;
    }
}
