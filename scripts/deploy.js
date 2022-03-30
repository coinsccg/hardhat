const hre = require("hardhat");
const shell = require("shelljs")

async function main() {

  // 部署BYDK
  const BYDK = await hre.ethers.getContractFactory("BYDK");
  const router = "0x10ED43C718714eb63d5aA57B78B54704E256024E" // pancake主网地址
  const usdt = "0x55d398326f99059fF775485246999027B3197955"  // usdt主网地址
  const bydk = await BYDK.deploy(router, usdt);
  await bydk.deployed();
  const bep20Address = bydk.address;
  console.log("BYDK deployed to:", bep20Address);
  
  // 部署Exchange
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const A = '0xfb5B32aD0f1c6e8AE04D2C261dCD22eFEa54A7d0'          // 预售钱包地址
  const oldAdress = "0x19Aef1567B10f5fd88E8Bd9eb5faA512a34186c6"
  const exchange = await Exchange.deploy(oldAdress, bep20Address, A)
  await exchange.deployed();
  const exchangeAddress = exchange.address;
  console.log("Exchange deployed to:", exchangeAddress);


  // 部署TokenTimeLock
  const TokenTimelock = await hre.ethers.getContractFactory("TokenTimelock");
  const owner = "0x88a54dD1DCb8FC9Eab0426856A9088988c0172Ce" // 收益地址
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
// npx hardhat verify --network mainnet 0xFEefF156d1F2C3cD4dB2d4343F741F6971235E4b "0x10ED43C718714eb63d5aA57B78B54704E256024E" "0x55d398326f99059fF775485246999027B3197955"