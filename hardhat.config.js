require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan"); // 合约验证
require('dotenv').config() // 解析.env

 module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/457c1ac43c544b05abfef0163084a7a6",
      accounts: [process.env.PRIVKEY]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/457c1ac43c544b05abfef0163084a7a6",
      accounts: [process.env.PRIVKEY]
    },
    bscTest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [process.env.PRIVKEY]
    },
    hecoTest: { // 验证失败
      url: "https://http-testnet.hecochain.com/",
      accounts: [process.env.PRIVKEY]
    }
  },
  
  etherscan: {
    apiKey: {
      rinkeby: process.env.RINKEBY_APIKEY,
      ropsten: process.env.RINKEBY_APIKEY,
      bscTest: process.env.BSCTEST_APIKEY,
      hecoTest: process.env.HECOTEST_APIKEY
    },
    customChains: [
      {
        network: "bscTest",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/"
        }
      },
      {
        network: "hecoTest",
        chainId: 256,
        urls: {
          apiURL: "https://api-testnet.hecoinfo.com/api",
          browserURL: "https://testnet.hecoinfo.com"
        }
      }
    ]
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
