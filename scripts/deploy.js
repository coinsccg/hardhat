const hre = require("hardhat");
const shell = require("shelljs")

async function main() {

  // 部署BYDK
  const BYDK = await hre.ethers.getContractFactory("BYDK");
  const router = "" // pancake主网地址
  const usdt = ""  // usdt主网地址
  const bydk = await BYDK.deploy(router, usdt);
  await bydk.deployed();
  const bep20Address = bydk.address;
  console.log("BYDK deployed to:", bep20Address);
  
  // 部署Exchange
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const A = ''          // 预售钱包地址
  const oldAdress = ""
  const exchange = await Exchange.deploy(oldAdress, bep20Address, A)
  await exchange.deployed();
  const exchangeAddress = exchange.address;
  console.log("Exchange deployed to:", exchangeAddress);


  // 部署TokenTimeLock
  const TokenTimelock = await hre.ethers.getContractFactory("TokenTimelock");
  const owner = "" // 收益地址
  const tokenLock = await TokenTimelock.deploy(bep20Address, owner);
  await tokenLock.deployed();
  const lockAddress = tokenLock.address;
  console.log("TokenTimelock deployed to:", lockAddress);


  // 部署BatchTransfer
  const BatchTransfer = await hre.ethers.getContractFactory("BatchTransfer");
  const batchTransfer = await BatchTransfer.deploy(bep20Address);
  await batchTransfer.deployed();
  const batchTransferAddress = batchTransfer.address;
  console.log("BatchTransfer deployed to:", batchTransferAddress);
  

  // shell.exec("npx hardhat verify --network mainnet " + bep20Address + " " + router + " " + usdt)
  
  // console.log("\n")

  // shell.exec("npx hardhat verify --network mainnet " + exchangeAddress + " " + oldAdress + " " + bep20Address + " " + A)

  // console.log("\n")

  // shell.exec("npx hardhat verify --network mainnet " + lockAddress + " " + bep20Address + " " + owner)

  // console.log("\n")

  // shell.exec("npx hardhat verify --network mainnet " + batchTransferAddress + " " + bep20Address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// 编译
// npx hardhat compile
// 迁移
// npx hardhat run --network mainnet scripts/deploy.js
// 验证
// npx hardhat verify --network mainnet contractAddress "" ""
