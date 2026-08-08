// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/TickTock.sol";

contract TickTockTest is Test {
    TickTock public game;
    address public player1 = address(0x1);
    address public player2 = address(0x2);

    function setUp() public {
        game = new TickTock();
    }

    function test_RegisterPlayer() public {
        vm.prank(player1);
        game.registerPlayer();

        (uint256 energy, uint256 score, , bool isReg) = game.players(player1);
        assertTrue(isReg);
        assertEq(energy, 1000);
        assertEq(score, 0);
    }

    function test_DeployUnit() public {
        vm.prank(player1);
        game.registerPlayer();

        vm.prank(player1);
        game.deployUnit(2, 3, TickTock.UnitType.DRONE);

        (address owner, TickTock.UnitType uType, uint256 hp, ) = game.grid(2, 3);
        assertEq(owner, player1);
        assertEq(uint8(uType), uint8(TickTock.UnitType.DRONE));
        assertEq(hp, 100);
    }

    function test_AttackTile() public {
        vm.prank(player1);
        game.registerPlayer();
        vm.prank(player1);
        game.deployUnit(0, 0, TickTock.UnitType.DRONE);

        vm.prank(player2);
        game.registerPlayer();
        vm.prank(player2);
        game.deployUnit(0, 1, TickTock.UnitType.MINING_RIG); // 250 HP

        // First attack: Drone does 80 damage -> HP reduces to 170
        vm.prank(player1);
        game.attackTile(0, 0, 0, 1);

        (address owner, , uint256 hp, ) = game.grid(0, 1);
        assertEq(owner, player2);
        assertEq(hp, 170);

        // Attack 2, 3 & 4 to destroy (80 * 4 = 320 > 250 HP)
        vm.prank(player1);
        game.attackTile(0, 0, 0, 1); // HP: 90
        vm.prank(player1);
        game.attackTile(0, 0, 0, 1); // HP: 10
        vm.prank(player1);
        game.attackTile(0, 0, 0, 1); // Defeated & captured!

        (address newOwner, , , ) = game.grid(0, 1);
        assertEq(newOwner, player1);
    }
}
