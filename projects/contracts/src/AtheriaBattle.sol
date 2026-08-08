// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./AtheriaVault.sol";

/**
 * @title AtheriaBattle
 * @notice Real-time Hex Grid Battle & Raid Resolution for Atheria: Yield Wars.
 * Optimized for Monad 400ms block execution.
 */
contract AtheriaBattle {
    enum UnitType { NONE, CITADEL, ARCANE_TOWER, CRYSTAL_BARRICADE, ARCANE_MAGE, SERAPH_GLIDER }

    struct Tile {
        address owner;
        UnitType unitType;
        uint256 hp;
        uint256 maxHp;
        uint256 attackPower;
        uint256 lastActionBlock;
    }

    struct PlayerProfile {
        uint8 baseTileX;
        uint8 baseTileY;
        uint256 score;
        uint256 totalRaidsWon;
        bool hasBase;
    }

    uint8 public constant GRID_SIZE = 10;
    AtheriaVault public immutable vault;

    mapping(address => PlayerProfile) public players;
    mapping(uint8 => mapping(uint8 => Tile)) public grid;

    event BaseRegistered(address indexed player, uint8 x, uint8 y);
    event UnitDeployed(address indexed player, uint8 x, uint8 y, UnitType unitType);
    event BattleResolved(
        address indexed attacker,
        address indexed defender,
        uint256 damage,
        bool citadelDestroyed,
        uint256 yieldStolen
    );

    modifier validCoords(uint8 x, uint8 y) {
        require(x < GRID_SIZE && y < GRID_SIZE, "Invalid grid coordinates");
        _;
    }

    constructor(address _vaultAddress) {
        vault = AtheriaVault(_vaultAddress);
    }

    /**
     * @notice Register Celestial Citadel Base on Hex Grid
     */
    function registerBase(uint8 x, uint8 y) external validCoords(x, y) {
        require(!players[msg.sender].hasBase, "Base already registered");
        require(grid[x][y].owner == address(0), "Tile occupied");

        grid[x][y] = Tile({
            owner: msg.sender,
            unitType: UnitType.CITADEL,
            hp: 1000,
            maxHp: 1000,
            attackPower: 50,
            lastActionBlock: block.number
        });

        players[msg.sender] = PlayerProfile({
            baseTileX: x,
            baseTileY: y,
            score: 100,
            totalRaidsWon: 0,
            hasBase: true
        });

        emit BaseRegistered(msg.sender, x, y);
    }

    /**
     * @notice Deploy troop unit (Arcane Mage or Seraph Glider) or defense structure
     */
    function deployUnit(uint8 x, uint8 y, UnitType unitType) external validCoords(x, y) {
        require(players[msg.sender].hasBase, "Must register base first");
        require(grid[x][y].owner == address(0), "Tile occupied");
        require(
            unitType == UnitType.ARCANE_TOWER || 
            unitType == UnitType.CRYSTAL_BARRICADE || 
            unitType == UnitType.ARCANE_MAGE || 
            unitType == UnitType.SERAPH_GLIDER,
            "Invalid unit type"
        );

        (uint256 hp, uint256 atk) = getUnitStats(unitType);

        grid[x][y] = Tile({
            owner: msg.sender,
            unitType: unitType,
            hp: hp,
            maxHp: hp,
            attackPower: atk,
            lastActionBlock: block.number
        });

        players[msg.sender].score += 25;
        emit UnitDeployed(msg.sender, x, y, unitType);
    }

    /**
     * @notice Resolve attack between attacker tile and defender target tile
     */
    function resolveAttack(
        uint8 attackerX, 
        uint8 attackerY, 
        uint8 defenderX, 
        uint8 defenderY
    ) external validCoords(attackerX, attackerY) validCoords(defenderX, defenderY) {
        Tile storage attackerTile = grid[attackerX][attackerY];
        Tile storage defenderTile = grid[defenderX][defenderY];

        require(attackerTile.owner == msg.sender, "Not owner of attacking unit");
        require(defenderTile.owner != address(0) && defenderTile.owner != msg.sender, "Invalid target");

        uint256 damage = attackerTile.attackPower;
        address defenderOwner = defenderTile.owner;
        bool citadelDestroyed = false;
        uint256 yieldStolen = 0;

        if (defenderTile.hp <= damage) {
            if (defenderTile.unitType == UnitType.CITADEL) {
                citadelDestroyed = true;
                // Steal 30% unclaimed yield (3000 BPS)
                yieldStolen = vault.stealYield(defenderOwner, msg.sender, 3000);
                players[msg.sender].totalRaidsWon += 1;
                players[msg.sender].score += 300;
            }

            // Move attacker into tile
            grid[defenderX][defenderY] = Tile({
                owner: msg.sender,
                unitType: attackerTile.unitType,
                hp: attackerTile.hp,
                maxHp: attackerTile.maxHp,
                attackPower: attackerTile.attackPower,
                lastActionBlock: block.number
            });

            delete grid[attackerX][attackerY];
        } else {
            defenderTile.hp -= damage;
        }

        emit BattleResolved(
            msg.sender,
            defenderOwner,
            damage,
            citadelDestroyed,
            yieldStolen
        );
    }

    /**
     * @notice Returns stats (HP, Attack) for unit type
     */
    function getUnitStats(UnitType u) public pure returns (uint256 hp, uint256 atk) {
        if (u == UnitType.CITADEL) return (1000, 50);
        if (u == UnitType.ARCANE_TOWER) return (600, 120);
        if (u == UnitType.CRYSTAL_BARRICADE) return (800, 20);
        if (u == UnitType.ARCANE_MAGE) return (250, 180);
        if (u == UnitType.SERAPH_GLIDER) return (350, 220);
        return (0, 0);
    }
}
