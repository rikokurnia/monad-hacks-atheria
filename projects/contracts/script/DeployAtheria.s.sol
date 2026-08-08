// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/AtheriaVault.sol";
import "../src/AtheriaBattle.sol";

contract DeployAtheria is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed to:", address(usdc));

        // 2. Deploy AtheriaVault
        AtheriaVault vault = new AtheriaVault(address(usdc));
        console.log("AtheriaVault deployed to:", address(vault));

        // 3. Deploy AtheriaBattle
        AtheriaBattle battle = new AtheriaBattle(address(vault));
        console.log("AtheriaBattle deployed to:", address(battle));

        // 4. Link Battle Contract to Vault
        vault.setBattleContract(address(battle));
        console.log("AtheriaVault linked to AtheriaBattle");

        vm.stopBroadcast();
    }
}
