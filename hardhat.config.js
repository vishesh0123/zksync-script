require("@nomicfoundation/hardhat-toolbox");
require("./tasks/bridge_to_zksync_era");
require('./tasks/swap_eth_to_usdc_mute');
require('./tasks/swap_usdc_to_eth_syncswap');
require("./tasks/swap_eth_to_usdc_symbiosis");
require("./tasks/bridge_out");
require("./tasks/migrations/mainnet");
require("./tasks/migrations/testnet");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    zksyncEraMainnet: {
      url: 'https://mainnet.era.zksync.io',
      accounts: [process.env.PRIVATE_KEY]
    },
    zksyncSepoliaTestnet: {
      url: 'https://sepolia.era.zksync.dev',
      accounts: [process.env.PRIVATE_KEY]
    },
    arbitrum: {
      url: 'https://1rpc.io/arb',
      accounts: [process.env.PRIVATE_KEY]
    },
    ethereum: {
      url: 'https://1rpc.io/eth',
      accounts: [process.env.PRIVATE_KEY]
    },
    optimism: {
      url: 'https://1rpc.io/op',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
