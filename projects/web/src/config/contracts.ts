export const MONAD_TESTNET_CHAIN_ID = 10143;
export const MONAD_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz";

export const CONTRACT_ADDRESSES = {
  mockUsdc: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "0xe242738c8235317105c5716fAAf1B7C7cC676FFA") as `0x${string}`,
  atheriaVault: (process.env.NEXT_PUBLIC_ATHERIA_VAULT_ADDRESS || "0x68Aef8dE7d7eAc00EdA743dC8BfFd29283566e33") as `0x${string}`,
  atheriaBattle: (process.env.NEXT_PUBLIC_ATHERIA_BATTLE_ADDRESS || "0x84b91D785C267500e7b59c94D62aa54813cD54c5") as `0x${string}`,
};

export const MOCK_USDC_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function faucet(address to, uint256 amount) external",
] as const;

export const ATHERIA_VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function claimYield() external",
  "function getPendingYield(address user) external view returns (uint256)",
  "function vaults(address user) external view returns (uint256 principal, uint256 lastUpdateTimestamp, uint256 unclaimedYield)",
] as const;

export const ATHERIA_BATTLE_ABI = [
  "function registerBase(uint8 x, uint8 y) external",
  "function deployUnit(uint8 x, uint8 y, uint8 unitType) external",
  "function resolveAttack(uint8 attackerX, uint8 attackerY, uint8 defenderX, uint8 defenderY) external",
  "function players(address player) external view returns (uint8 baseTileX, uint8 baseTileY, uint256 score, uint256 totalRaidsWon, bool hasBase)",
  "function grid(uint8 x, uint8 y) external view returns (address owner, uint8 unitType, uint256 hp, uint256 maxHp, uint256 attackPower, uint256 lastActionBlock)",
] as const;
