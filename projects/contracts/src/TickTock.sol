// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TickTock: Monad Warfare
 * @notice Fully on-chain real-time strategy game optimized for Monad's 400ms block time.
 */
contract TickTock {
    enum UnitType { NONE, DRONE, BARRIER, MINING_RIG }

    struct Player {
        uint256 energy;
        uint256 score;
        uint256 lastClaimBlock;
        bool isRegistered;
    }

    struct Tile {
        address owner;
        UnitType unitType;
        uint256 hp;
        uint256 lastActionBlock;
    }

    uint8 public constant GRID_SIZE = 10; // 10x10 grid
    uint256 public constant INITIAL_ENERGY = 1000;
    uint256 public constant DRONE_COST = 200;
    uint256 public constant BARRIER_COST = 500;
    uint256 public constant MINING_RIG_COST = 800;

    mapping(address => Player) public players;
    mapping(uint8 => mapping(uint8 => Tile)) public grid;

    event PlayerRegistered(address indexed player, uint256 timestamp);
    event UnitDeployed(address indexed player, uint8 x, uint8 y, UnitType unitType);
    event TileAttacked(address indexed attacker, address indexed defender, uint8 x, uint8 y, uint256 damageDealt);
    event EnergyClaimed(address indexed player, uint256 amount);

    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }

    modifier validCoords(uint8 x, uint8 y) {
        require(x < GRID_SIZE && y < GRID_SIZE, "Invalid coordinates");
        _;
    }

    /**
     * @notice Register a new player and grant initial energy
     */
    function registerPlayer() external {
        require(!players[msg.sender].isRegistered, "Already registered");
        players[msg.sender] = Player({
            energy: INITIAL_ENERGY,
            score: 0,
            lastClaimBlock: block.number,
            isRegistered: true
        });

        emit PlayerRegistered(msg.sender, block.timestamp);
    }

    /**
     * @notice Deploy a unit to an empty grid tile
     */
    function deployUnit(uint8 x, uint8 y, UnitType unitType) external onlyRegistered validCoords(x, y) {
        require(unitType != UnitType.NONE, "Invalid unit type");
        Tile storage tile = grid[x][y];
        require(tile.owner == address(0), "Tile occupied");

        uint256 cost = getUnitCost(unitType);
        require(players[msg.sender].energy >= cost, "Insufficient energy");

        players[msg.sender].energy -= cost;

        uint256 hp = getUnitMaxHp(unitType);
        grid[x][y] = Tile({
            owner: msg.sender,
            unitType: unitType,
            hp: hp,
            lastActionBlock: block.number
        });

        players[msg.sender].score += 50;

        emit UnitDeployed(msg.sender, x, y, unitType);
    }

    /**
     * @notice Attack an adjacent enemy tile
     */
    function attackTile(uint8 fromX, uint8 fromY, uint8 targetX, uint8 targetY) external onlyRegistered validCoords(fromX, fromY) validCoords(targetX, targetY) {
        Tile storage attackerTile = grid[fromX][fromY];
        Tile storage defenderTile = grid[targetX][targetY];

        require(attackerTile.owner == msg.sender, "Not owner of attacker tile");
        require(defenderTile.owner != address(0) && defenderTile.owner != msg.sender, "No enemy unit to attack");

        uint256 damage = getUnitAttackPower(attackerTile.unitType);

        if (defenderTile.hp <= damage) {
            address defenderOwner = defenderTile.owner;
            // Overtake tile
            grid[targetX][targetY] = Tile({
                owner: msg.sender,
                unitType: attackerTile.unitType,
                hp: getUnitMaxHp(attackerTile.unitType) / 2,
                lastActionBlock: block.number
            });

            // Clear old attacker tile
            delete grid[fromX][fromY];
            players[msg.sender].score += 150;

            emit TileAttacked(msg.sender, defenderOwner, targetX, targetY, damage);
        } else {
            defenderTile.hp -= damage;
            emit TileAttacked(msg.sender, defenderTile.owner, targetX, targetY, damage);
        }
    }

    /**
     * @notice Passive energy generation claim
     */
    function claimPassiveEnergy() external onlyRegistered {
        Player storage p = players[msg.sender];
        uint256 blocksPassed = block.number - p.lastClaimBlock;
        require(blocksPassed > 0, "No blocks passed");

        uint256 generated = blocksPassed * 10;
        p.energy += generated;
        p.lastClaimBlock = block.number;

        emit EnergyClaimed(msg.sender, generated);
    }

    // Helper functions
    function getUnitCost(UnitType u) public pure returns (uint256) {
        if (u == UnitType.DRONE) return DRONE_COST;
        if (u == UnitType.BARRIER) return BARRIER_COST;
        if (u == UnitType.MINING_RIG) return MINING_RIG_COST;
        return 0;
    }

    function getUnitMaxHp(UnitType u) public pure returns (uint256) {
        if (u == UnitType.DRONE) return 100;
        if (u == UnitType.BARRIER) return 500;
        if (u == UnitType.MINING_RIG) return 250;
        return 0;
    }

    function getUnitAttackPower(UnitType u) public pure returns (uint256) {
        if (u == UnitType.DRONE) return 80;
        if (u == UnitType.BARRIER) return 30;
        if (u == UnitType.MINING_RIG) return 10;
        return 0;
    }
}
