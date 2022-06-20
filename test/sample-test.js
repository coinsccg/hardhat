const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Azuki", () => {
  let az;

  before("deploy Azuki", async () => {
    const Azuki = await ethers.getContractFactory("Azuki");
    az = await Azuki.deploy();
    await az.deployed();
    console.log("azuki address: %s", az.address);
  })

  describe("#mintWarpper", () => {
    it("mint nft amount", async () => {
      const to = "0x7cD1CB03FAE64CBab525C3263DBeB821Afd64483";
      const quantity = 2;
      const tx = await az.mintWarpper(to, quantity);
      await tx.wait();
  
      expect(await az.balanceOf(to)).to.equal(2);
    });
  })

  describe("#setBaseURI", () => {
    it("set base url", async () => {
      const baseUrl = "https://ipfs.io/ipfs/QmadKbT6E6MtFfsp399zFtS4E3mKcyYuLSxUspnm2qtSMY/"
      const tx = await az.setBaseURI(baseUrl);
      await tx.wait();
  
      expect(await az.tokenURI(1)).to.equal(baseUrl + "1");
    });
  })
});
