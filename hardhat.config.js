require("dotenv").config();
require("@reef-defi/hardhat-reef");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.reef.getSigners();

  for await (const account of accounts) {
    const address = await account.getAddress();
    console.log(address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
//

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "reef",
  networks: {
    reef: {
      url: "ws://substrate-node:9944",
      scanUrl: "http://api:8000",
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      scanUrl: "https://testnet.reefscan.com", // Localhost verification testing: http://localhost:3000
      seeds: {
        account1: process.env.MNEMONIC_ACCOUNT_1 || "",
        account2: process.env.MNEMONIC_ACCOUNT_2 || "",
        account3: process.env.MNEMONIC_ACCOUNT_3 || "",
        account4: process.env.MNEMONIC_ACCOUNT_4 || "",
        account5: process.env.MNEMONIC_ACCOUNT_5 || "",
      }
    },
    reef_mainnet: {
      url: "wss://rpc.reefscan.com/ws",
      scanUrl: "wss://reefscan.com",
      seeds: {
        mainnet_account: process.env.MNEMONIC_MAINNET || "",
      },
    },
  },
};
