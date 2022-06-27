require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require("@truffle/hdwallet-provider");

const private_keys = [
  'c1c7f0889ca07dc869662d1cb098c738bd6bc25394f5d72e980935272122168a',
  '040fa8653bf4de637a0ad3fe823281bcddec07b92b69531407c918fd70c1f570'
]

module.exports = {
  networks: {
    //development: {
      //host: "127.0.0.1",
      //port: 8545,
      //network_id: "*" // Match any network id
    //},
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: private_keys,
        providerOrUrl: "https://rinkeby.infura.io/v3/faa5f12214c94c91badefd8be99646b5",
        numberOfAddresses: 2

      }),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
