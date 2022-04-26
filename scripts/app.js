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
const owner = ''     // 总地址
const A = ''         // 预售地址
const D = ''         // 空投地址
const B = ""         // 技术地址
const C = ""         // 风投地址
const E = ""         // 社区地址
const F = ""         // D池地址
const I = ""         // 竞赛地址
const J = ""         // 持币分红地址
const K = ""         // lp分红地址
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
    // await includeWhiteList(owner, owner, privateKeyOwner, bep20ContractAddress)       
    // await includeWhiteList(owner, A, privateKeyOwner, bep20ContractAddress)          
    // await includeWhiteList(owner, B, privateKeyOwner, bep20ContractAddress)          
    // await includeWhiteList(owner, C, privateKeyOwner, bep20ContractAddress)        
    // await includeWhiteList(owner, D, privateKeyOwner, bep20ContractAddress)         
    // await includeWhiteList(owner, E, privateKeyOwner, bep20ContractAddress)           
    // await includeWhiteList(owner, F, privateKeyOwner, bep20ContractAddress)         
    // await includeWhiteList(owner, lockContractAddress, privateKeyOwner, bep20ContractAddress)     
    // await includeWhiteList(owner, exchangeContractAddress, privateKeyOwner, bep20ContractAddress)  
    // await includeWhiteList(owner, bep20ContractAddress, privateKeyOwner, bep20ContractAddress)     
    // await includeWhiteList(owner, batchTransferAddress, privateKeyOwner, bep20ContractAddress)    
    console.log('-----------------------设置白名单  结束-------------------------')

    console.log('-----------------------设置黑名单  开始------------------------')
    const back1 = ""
    const back2 = ""
    // await includeBackListERC20(owner, back1, privateKeyOwner, bep20ContractAddress)
    // await includeBackListERC20(owner, back2, privateKeyOwner, bep20ContractAddress)
    console.log('-----------------------设置黑名单  结束------------------------')

    console.log('-----------------------转账  开始-------------------------------')
    // await transfer(owner, A, '1200000000000000000000000', privateKeyOwner, bep20ContractAddress)                     
    // await transfer(owner, lockContractAddress, '100000000000000000000000', privateKeyOwner, bep20ContractAddress)   
    // await transfer(owner, D, '60000000000000000000000', privateKeyOwner, bep20ContractAddress)                   
    // await transfer(owner, E, '40000000000000000000000', privateKeyOwner, bep20ContractAddress)                      
    // await transfer(owner, F, '20000000000000000000000', privateKeyOwner, bep20ContractAddress)                 
    console.log('-----------------------转账  结束-------------------------------')

    console.log('-----------------------授权  开始-------------------------------')
    // await approve(A, exchangeContractAddress, '1200000000000000000000000', privateKeyPreSale, bep20ContractAddress) 
    // await approve(J, batchTransferAddress, '1200000000000000000000000', privateKeyShare, bep20ContractAddress)   
    // await approve(K, batchTransferAddress, '1200000000000000000000000', privateKeyLP, bep20ContractAddress) 
    console.log('-----------------------授权  结束-------------------------------')

    console.log('-----------------------销毁  开始-------------------------------')
    // await burn(owner, "580000000000000000000000", privateKeyOwner, bep20ContractAddress)               
    console.log('-----------------------销毁  结束-------------------------------')

    // owner向合约地址授权USDT  执行完成后检查（浏览器查询）
    console.log('-----------------------USDT授权  开始---------------------------')
    // await approveUSDT(owner, bep20ContractAddress, "10000000000000000000000000000", privateKeyOwner)     
    console.log('-----------------------USDT授权  结束---------------------------')

    // 置换合约加入黑名单
    console.log('-----------------------Exchange加入黑名单  开始---------------------------')
    await includeBackList(owner, back1, privateKeyOwner, exchangeContractAddress)
    await includeBackList(owner, back2, privateKeyOwner, exchangeContractAddress)
    console.log('-----------------------Exchange加入黑名单  结束---------------------------')
}

const BYDKAddress = ''     
const ExchangeAddress = '' 
const LockAddress = ''     
const BatchTransferAddress = ''     
call(BYDKAddress, ExchangeAddress, LockAddress, BatchTransferAddress)
