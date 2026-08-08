// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AtheriaVault
 * @notice Lossless DeFi Yield Vault for Atheria: Yield Wars.
 * Principal funds remain 100% safe. Raids only steal unclaimed yield!
 */
contract AtheriaVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    address public battleContract;

    // Fast yield multiplier for hackathon demo (10% APY per minute simulated)
    uint256 public constant YIELD_RATE_PER_SECOND = 100; // Basis points rate scaler

    struct UserVault {
        uint256 principal;       // Staked USDC amount (ALWAYS SAFE)
        uint256 lastUpdateTimestamp;
        uint256 unclaimedYield;  // Yield accumulated so far
    }

    mapping(address => UserVault) public vaults;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 amount);
    event YieldStolen(address indexed defender, address indexed attacker, uint256 amountStolen);

    modifier onlyBattle() {
        require(msg.sender == battleContract, "Caller is not Battle Contract");
        _;
    }

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    function setBattleContract(address _battleContract) external onlyOwner {
        battleContract = _battleContract;
    }

    /**
     * @notice Calculate pending unclaimed yield since last update
     */
    function getPendingYield(address user) public view returns (uint256) {
        UserVault memory v = vaults[user];
        if (v.principal == 0) return v.unclaimedYield;

        uint256 timeElapsed = block.timestamp - v.lastUpdateTimestamp;
        // Demo rate: principal * timeElapsed * rate / 100,000
        uint256 newYield = (v.principal * timeElapsed * YIELD_RATE_PER_SECOND) / 100_000;
        return v.unclaimedYield + newYield;
    }

    /**
     * @notice Deposit USDC principal into Celestial Citadel Vault
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Cannot deposit 0");

        _updateYield(msg.sender);

        vaults[msg.sender].principal += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw principal (100% Lossless)
     */
    function withdraw(uint256 amount) external {
        UserVault storage v = vaults[msg.sender];
        require(v.principal >= amount, "Exceeds principal balance");

        _updateYield(msg.sender);

        v.principal -= amount;
        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated yield
     */
    function claimYield() external {
        _updateYield(msg.sender);

        UserVault storage v = vaults[msg.sender];
        uint256 yieldToClaim = v.unclaimedYield;
        require(yieldToClaim > 0, "No yield available");

        v.unclaimedYield = 0;
        
        // Mint / Transfer yield (for demo, transferred from vault balance or mock token)
        stakingToken.safeTransfer(msg.sender, yieldToClaim);

        emit YieldClaimed(msg.sender, yieldToClaim);
    }

    /**
     * @notice Steal up to `percentageBps` of unclaimed yield from defender during a successful raid
     * @dev Only callable by AtheriaBattle contract! Principal is NEVER touched.
     */
    function stealYield(address defender, address attacker, uint256 percentageBps) external onlyBattle returns (uint256) {
        require(percentageBps <= 10000, "Invalid percentage");

        _updateYield(defender);

        UserVault storage defenderVault = vaults[defender];
        uint256 totalYield = defenderVault.unclaimedYield;

        if (totalYield == 0) return 0;

        uint256 stolenAmount = (totalYield * percentageBps) / 10000;
        defenderVault.unclaimedYield -= stolenAmount;

        _updateYield(attacker);
        vaults[attacker].unclaimedYield += stolenAmount;

        emit YieldStolen(defender, attacker, stolenAmount);
        return stolenAmount;
    }

    function _updateYield(address user) internal {
        UserVault storage v = vaults[user];
        v.unclaimedYield = getPendingYield(user);
        v.lastUpdateTimestamp = block.timestamp;
    }
}
