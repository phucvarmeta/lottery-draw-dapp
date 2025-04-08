require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("hardhat-docgen");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-tracer");
require("hardhat-log-remover");
require('dotenv').config()

const mnemonic = process.env.MNEMONIC

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: {
        mnemonic,
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: {
        mnemonic,
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: {
        mnemonic,
      },
    },
    amoy: {
      url: 'https://rpc-amoy.polygon.technology',
      accounts: {
        mnemonic,
      },
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      accounts: {
        mnemonic,
      },
    },
    bscmainnet: {
      url: `https://bsc-dataseed4.binance.org/`,
      accounts: {
        mnemonic,
      },
    },
    ftmtestnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: {
        mnemonic,
      },
    },
  },
  etherscan: {
    apiKey: {
      goerli: `${process.env.ETHERSCAN_KEY}`,
      sepolia: `${process.env.ETHERSCAN_KEY}`,
      polygonMumbai: `${process.env.POLYGONSCAN_KEY}`,
      mainnet: `${process.env.ETHERSCAN_KEY}`,
      bscTestnet: `${process.env.BSCSCAN_KEY}`,
      bsc: `${process.env.BSCSCAN_KEY}`,
      polygonMainnet: `${process.env.POLYGONSCAN_KEY}`,
      ftmTestnet: `${process.env.FANTOM_KEY}`,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true,
            },
          },
          viaIR: true,
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 200000,
    reporter: "mocha-multi-reporters",
    reporterOptions: {
      configFile: "./mocha-report.json",
    },
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: false,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 1,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "BNB",
    excludeContracts: [],
    src: "./contracts",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};
