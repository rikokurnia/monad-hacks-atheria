// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";
import "../src/AtheriaVault.sol";
import "../src/AtheriaBattle.sol";

contract AtheriaTest is Test {
    MockUSDC public usdc;
    AtheriaVault public vault;
    AtheriaBattle public battle;

    address public alice = address(0x111);
    address public bob = address(0x222);

    function setUp() public {
        usdc = new MockUSDC();
        vault = new AtheriaVault(address(usdc));
        battle = new AtheriaBattle(address(vault));

        vault.setBattleContract(address(battle));

        // Give initial USDC via faucet
        usdc.faucet(alice, 1000 * 10**6);
        usdc.faucet(bob, 1000 * 10**6);

        vm.prank(alice);
        usdc.approve(address(vault), type(uint256).max);

        vm.prank(bob);
        usdc.approve(address(vault), type(uint256).max);
    }

    function test_Faucet() public view {
        assertEq(usdc.balanceOf(alice), 1000 * 10**6);
        assertEq(usdc.balanceOf(bob), 1000 * 10**6);
    }

    function test_DepositAndYieldGeneration() public {
        vm.prank(alice);
        vault.deposit(500 * 10**6);

        // Fast forward 60 seconds
        vm.warp(block.timestamp + 60);

        uint256 pending = vault.getPendingYield(alice);
        assertTrue(pending > 0, "Yield should accumulate");
    }

    function test_RegisterBaseAndDeployUnits() public {
        vm.prank(alice);
        battle.registerBase(2, 3);

        (uint8 x, uint8 y, , , bool hasBase) = battle.players(alice);
        assertTrue(hasBase);
        assertEq(x, 2);
        assertEq(y, 3);

        // Deploy Arcane Mage at (2, 4)
        vm.prank(alice);
        battle.deployUnit(2, 4, AtheriaBattle.UnitType.ARCANE_MAGE);

        (address owner, AtheriaBattle.UnitType uType, uint256 hp,,, ) = battle.grid(2, 4);
        assertEq(owner, alice);
        assertTrue(uType == AtheriaBattle.UnitType.ARCANE_MAGE);
        assertEq(hp, 250);
    }

    function test_RaidAndStealLosslessYield() public {
        // Alice deposits 500 USDC
        vm.prank(alice);
        vault.deposit(500 * 10**6);

        // Bob deposits 500 USDC
        vm.prank(bob);
        vault.deposit(500 * 10**6);

        // Advance 100 seconds so Bob accumulates yield
        vm.warp(block.timestamp + 100);

        uint256 bobYieldBefore = vault.getPendingYield(bob);
        assertTrue(bobYieldBefore > 0);

        // Register Bob base at (5, 5)
        vm.prank(bob);
        battle.registerBase(5, 5);

        // Alice deploys Seraph Glider at (5, 4)
        vm.prank(alice);
        battle.registerBase(1, 1);

        vm.prank(alice);
        battle.deployUnit(5, 4, AtheriaBattle.UnitType.SERAPH_GLIDER);

        // Alice attacks Bob Citadel (5,5) repeatedly until destroyed
        vm.startPrank(alice);
        for (uint i = 0; i < 5; i++) {
            (,, uint256 currentHp,,, ) = battle.grid(5, 5);
            if (currentHp > 0) {
                battle.resolveAttack(5, 4, 5, 5);
            }
        }
        vm.stopPrank();

        // Check that Alice stole ~30% of Bob's yield
        uint256 bobYieldAfter = vault.getPendingYield(bob);
        assertTrue(bobYieldAfter < bobYieldBefore, "Bob yield should decrease");
        
        uint256 aliceYieldAfter = vault.getPendingYield(alice);
        assertTrue(aliceYieldAfter > 0, "Alice should receive stolen yield");

        // IMPORTANT: Verify Principal is 100% SAFE (500 USDC intact)!
        (uint256 bobPrincipal,,) = vault.vaults(bob);
        assertEq(bobPrincipal, 500 * 10**6, "Bob principal MUST remain 100% safe!");
    }
}
