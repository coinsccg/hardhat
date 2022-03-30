var EthereumTx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;

const bscChainId = 56 // 主网
// const bscChainId = 97 // 测试网

const rpc = 'https://bsc-dataseed.binance.org'
// const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const pkOwner = ''   // 合约创建者地址私钥
const pkPreSale = '' // 合约预售地址私钥
const pkShare = ''   // 分红地址私钥
const pkLpShare = '' // lp分红地址私钥

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "router_",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "usdt_",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensSwapped",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethReceived",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensIntoLiqudity",
        "type": "uint256"
      }
    ],
    "name": "SwapAndLiquify",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "SwapAndLiquifyEnabledUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawlERC20",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawlUSDT",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "biddingAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "biddingRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "blackRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "burnMinAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "denominator",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "directRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeBraveTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeWhiteList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getInBlacklist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getInBraveTroops",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getInWhiteList",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeBraveTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeWhiteList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "indiretRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "limit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "liquifyRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lpShareAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lpShareRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numTokensSellToAddToLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minNumber",
        "type": "uint256"
      }
    ],
    "name": "setBurnMinAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "biddingAddress_",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "shareAddress_",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "lpShareAddress_",
        "type": "address"
      }
    ],
    "name": "setCollectFeeAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "limit_",
        "type": "uint256"
      }
    ],
    "name": "setMaxTransferLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "swapNumber",
        "type": "uint256"
      }
    ],
    "name": "setNumTokensSellToAddToLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "limit_",
        "type": "uint256"
      }
    ],
    "name": "setRelationTransferLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_enabled",
        "type": "bool"
      }
    ],
    "name": "setSwapAndLiquifyEnabled",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "directFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indirectFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lpShareRate_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "blackFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "shareFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "liquifyFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "biddingFee_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "denominator_",
        "type": "uint256"
      }
    ],
    "name": "setTransferFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "shareAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sharetRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapAndLiquifyEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2Pair",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Pair",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2Router",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdt",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawlERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawlUSDT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]
const owner = '0x88a54dD1DCb8FC9Eab0426856A9088988c0172Ce'     // 总地址
const A = '0xfb5B32aD0f1c6e8AE04D2C261dCD22eFEa54A7d0'         // 预售地址
const D = '0x7142E053198f8Aa6Fc70481d921c8EC7fb2fE95e'         // 空投地址
const B = "0x992F3b67d61a5DdA19A82932fDbb1535fFEd76D0"         // 技术地址
const C = "0xED8629b430c84251D8b3db0Ebc534Dc2fC98b5fe"         // 风投地址
const E = "0x472755134C04A8828EeF5fdbbcbd3BeD0e2226f0"         // 社区地址
const F = "0x84E1741f08bF34054b4E5a857D86052fD0A595Ec"         // D池地址
const I = "0x3256170667b9c5D3960ae6f9b68e4D84Bc9B1600"         // 竞赛地址
const J = "0x8D909BdFb9f4BC5De8AE9316BE916fF48E054791"         // 持币分红地址
const K = "0x6330001b89469b27662d346b5383D5008AfA49e4"         // lp分红地址
const web3 = new Web3(rpc)
const privateKeyOwner = Buffer.from(pkOwner, 'hex')
const privateKeyPreSale = Buffer.from(pkPreSale, 'hex')
const privateKeyShare = Buffer.from(pkShare, 'hex')
const privateKeyLP = Buffer.from(pkLpShare, 'hex')


// 转账
async function transfer(from, to, amount, privateKey, contractAddress) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.transfer(to, amount).encodeABI()
    // 创建交易对象
    const txObject = {
        from: from,
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        value: '0x00',
        data: data
    }

    const BSC = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: bscChainId,
        chainId: bscChainId,
        url: rpc
    },
    'istanbul',
    );

    // 签署交易
    const tx = new EthereumTx(txObject, {'common': BSC})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

// 授权
async function approve(from, to, amount, privateKey, contractAddress) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.approve(to, amount).encodeABI()

    const txObject = {
        from: from,
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        value: '0x00',
        data: data
    }

    const BSC = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: bscChainId,
        chainId: bscChainId,
        url: rpc
    },
    'istanbul',
    );

    // 签署交易
    const tx = new EthereumTx(txObject, {'common': BSC})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

// 设置白名单地址
async function includeWhiteList(from, to, privateKey, contractAddress) {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.includeWhiteList(to).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}

// 设置黑名单
async function includeBackListERC20(from, to, privateKey, contractAddress) {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.includeBlacklist(to).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}

// 销毁
async function burn(from, amount,  privateKey, contractAddress) {
  const contract = new web3.eth.Contract(contractABI, contractAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.burn(amount).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}

const usdtABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955" // 主网
// USDT 授权
async function approveUSDT(from, to, amount, privateKey) {
  const contract = new web3.eth.Contract(usdtABI, usdtAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.approve(to, amount).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: usdtAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}

const exchangeABI = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_oldA",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_newB",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_preSale",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ExchangeEvent",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "exchange",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExchange",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getExchangeAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getInBlacklist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newB",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oldA",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_isExchange",
        "type": "bool"
      }
    ],
    "name": "setExchange",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
// 置换合约黑名单
async function includeBackList(from, to, privateKey, contractAddress) {
  const contract = new web3.eth.Contract(exchangeABI, contractAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.includeBlacklist(to).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}

async function call(bep20ContractAddress, exchangeContractAddress, lockContractAddress, batchTransferAddress) {
    console.log('-----------------------设置白名单  开始------------------------')
    // await includeWhiteList(owner, owner, privateKeyOwner, bep20ContractAddress)        // 总地址
    // await includeWhiteList(owner, A, privateKeyOwner, bep20ContractAddress)            // 预售地址
    // await includeWhiteList(owner, B, privateKeyOwner, bep20ContractAddress)            // 技术地址
    // await includeWhiteList(owner, C, privateKeyOwner, bep20ContractAddress)            // 风投地址
    // await includeWhiteList(owner, D, privateKeyOwner, bep20ContractAddress)            // 空投地址
    // await includeWhiteList(owner, E, privateKeyOwner, bep20ContractAddress)            // 社区地址
    // await includeWhiteList(owner, F, privateKeyOwner, bep20ContractAddress)            // D池地址
    // await includeWhiteList(owner, lockContractAddress, privateKeyOwner, bep20ContractAddress)      // 锁仓地址
    // await includeWhiteList(owner, exchangeContractAddress, privateKeyOwner, bep20ContractAddress)  // 置换地址
    // await includeWhiteList(owner, bep20ContractAddress, privateKeyOwner, bep20ContractAddress)     // BYDK地址
    // await includeWhiteList(owner, batchTransferAddress, privateKeyOwner, bep20ContractAddress)     // 批量转账合约地址
    console.log('-----------------------设置白名单  结束-------------------------')

    console.log('-----------------------设置黑名单  开始------------------------')
    const back1 = "0x4aeD67E8149F3B240fd9CDd6F3213755BB5C2fB4"
    const back2 = "0xb9478e5aac52433665b47ce827a470aa040f48f9"
    // await includeBackListERC20(owner, back1, privateKeyOwner, bep20ContractAddress)
    // await includeBackListERC20(owner, back2, privateKeyOwner, bep20ContractAddress)
    console.log('-----------------------设置黑名单  结束------------------------')

    console.log('-----------------------转账  开始-------------------------------')
    // await transfer(owner, A, '1200000000000000000000000', privateKeyOwner, bep20ContractAddress)                       // 预售地址
    // await transfer(owner, lockContractAddress, '100000000000000000000000', privateKeyOwner, bep20ContractAddress)      // 锁仓
    // await transfer(owner, D, '60000000000000000000000', privateKeyOwner, bep20ContractAddress)                         // 空投地址
    // await transfer(owner, E, '40000000000000000000000', privateKeyOwner, bep20ContractAddress)                         // 社区地址
    // await transfer(owner, F, '20000000000000000000000', privateKeyOwner, bep20ContractAddress)                         // 排除D池地址
    console.log('-----------------------转账  结束-------------------------------')

    console.log('-----------------------授权  开始-------------------------------')
    // await approve(A, exchangeContractAddress, '1200000000000000000000000', privateKeyPreSale, bep20ContractAddress) // 预售地址授权置换合约
    // await approve(J, batchTransferAddress, '1200000000000000000000000', privateKeyShare, bep20ContractAddress)      // 持币分红地址授权批量转账合约
    // await approve(K, batchTransferAddress, '1200000000000000000000000', privateKeyLP, bep20ContractAddress)         // LP分红地址授权批量转账合约
    console.log('-----------------------授权  结束-------------------------------')

    console.log('-----------------------销毁  开始-------------------------------')
    // await burn(owner, "580000000000000000000000", privateKeyOwner, bep20ContractAddress)                 // 游戏地址持币销毁
    console.log('-----------------------销毁  结束-------------------------------')

    // owner向合约地址授权USDT  执行完成后检查（浏览器查询）
    console.log('-----------------------USDT授权  开始---------------------------')
    // await approveUSDT(owner, bep20ContractAddress, "10000000000000000000000000000", privateKeyOwner)      // 主网usdt授权
    console.log('-----------------------USDT授权  结束---------------------------')

    // 置换合约加入黑名单
    console.log('-----------------------Exchange加入黑名单  开始---------------------------')
    await includeBackList(owner, back1, privateKeyOwner, exchangeContractAddress)
    await includeBackList(owner, back2, privateKeyOwner, exchangeContractAddress)
    console.log('-----------------------Exchange加入黑名单  结束---------------------------')
}

const BYDKAddress = '0xFEefF156d1F2C3cD4dB2d4343F741F6971235E4b'     // BYDK合约地址
const ExchangeAddress = '0x04EDDd3b335794754296e2FDC207789f1ae718e0' // 置换合约地址
const LockAddress = '0xd26Eb5a82A5Ef5391b76FBf08A2651165A0Eab8e'     // 锁仓合约地址
const BatchTransferAddress = '0xb72f838FBb569Ae7B9cfB66dd05143527585d1C0'     // 批量转账合约地址
call(BYDKAddress, ExchangeAddress, LockAddress, BatchTransferAddress)
