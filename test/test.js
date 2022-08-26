const { ethers } = require('hardhat')
const { expect } = require("chai");

describe("ERC721A合约和交易平台合约测试用例：\n", () => {
  const zero = "0x0000000000000000000000000000000000000000";
  let owner;
  let other;
  let nftTradePlatform;
  let trendyCat;
  let usdt;

  before("部署ERC721A合约和交易平台合约", async () => {
    [owner, other] = await ethers.getSigners();
    const USDT = await ethers.getContractFactory("USDT");
    const TrendyCat = await ethers.getContractFactory("TrendyCat");
    const NftTradePlatform = await ethers.getContractFactory(
      "NftTradePlatform"
    );

    const _free_numerator = 4;
    const _free_denominator = 1000;

    usdt = await USDT.deploy();
    await usdt.deployed();

    trendyCat = await TrendyCat.deploy();
    await trendyCat.deployed();

    nftTradePlatform = await NftTradePlatform.deploy(
      _free_numerator,
      _free_denominator
    );
    await nftTradePlatform.deployed();
  });

  describe("#mintWarpper", () => {
    it("测试铸造NFT函数\n", async () => {
      const quantity = 10;
      await trendyCat.connect(owner).mintWarpper(owner.address, quantity);

      expect(await trendyCat.connect(owner).balanceOf(owner.address)).to.equal(
        10
      );
      expect(await trendyCat.connect(owner).totalSupply()).to.equal(10);
    });
  });

  describe("#setBaseURI", () => {
    it("测试设置基础URL函数\n", async () => {
      const baseURL =
        "https://ipfs.io/ipfs/QmSnE8s4JyuCjybicTt2HCxGjATzFUSFBGxu8Bq8dQQPug/";
      await trendyCat.connect(owner).setBaseURI(baseURL);

      expect(await trendyCat.connect(owner).tokenURI(1)).to.equal(baseURL + 1);
    });
  });

  describe("#numberMinted", () => {
    it("测试铸造NFT数量函数\n", async () => {
      expect(
        await trendyCat.connect(owner).numberMinted(owner.address)
      ).to.equal(10);
    });
  });

  describe("#approve", () => {
    it("测试用户授权NFT函数\n", async () => {
      const quantity = 10;
      await trendyCat.connect(owner).approve(nftTradePlatform.address, 1);

      for (i = 1; i < quantity; i++) {
        await trendyCat.connect(owner).approve(nftTradePlatform.address, i);
      }
      expect(await trendyCat.connect(owner).getApproved(1)).to.equal(
        nftTradePlatform.address
      );
    });
  });

  describe("#stake", () => {
    it("测试用户质押NFT函数\n", async () => {
      await nftTradePlatform.connect(owner).stake(trendyCat.address, 1);
    });
  });

  describe("#delisting", () => {
    it("测试用户下架NFT函数\n", async () => {
      await nftTradePlatform.connect(owner).delisting(trendyCat.address, 1);

      expect(
        await nftTradePlatform.connect(owner).getTokenUp(trendyCat.address, 1)
      ).to.equal(false);
    });
  });

  describe("#listing", () => {
    it("测试用户上架NFT函数\n", async () => {
      await nftTradePlatform.connect(owner).listing(trendyCat.address, 1);

      expect(
        await nftTradePlatform.connect(other).getTokenUp(trendyCat.address, 1)
      ).to.equal(true);
    });
  });

  describe("#setMinPrice", () => {
    it("测试设置最低价格函数\n", async () => {
      await expect(
        nftTradePlatform
          .connect(other)
          .setMinPrice(ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await nftTradePlatform
        .connect(owner)
        .setMinPrice(ethers.utils.parseEther("1"));

      expect(await nftTradePlatform.connect(owner).MIN_PRICE()).to.equal(
        ethers.utils.parseEther("1")
      );
    });
  });

  describe("#setFree", () => {
    it("测试设置手续费函数\n", async () => {
      await expect(
        nftTradePlatform.connect(other).setFree(10, 10000)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await nftTradePlatform.connect(owner).setFree(10, 10000);
      expect(await nftTradePlatform.connect(owner).free_numerator()).to.equal(
        10
      );
      expect(await nftTradePlatform.connect(owner).free_denominator()).to.equal(
        10000
      );
    });
  });

  describe("#tradeForETH", () => {
    it("测试用户采用ETH购买NFT函数\n", async () => {
      const types = {
        Bid: [
          { name: "_contract", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "numerator", type: "uint256" },
          { name: "owner", type: "address" },
        ],
      };

      const domain = {
        name: "Nuoibo NFT",
        version: "1",
        chainId: 31337, // hardhat测试环境链ID
        verifyingContract: nftTradePlatform.address,
      };

      const price = ethers.utils.parseEther("1");
      const value = {
        _contract: trendyCat.address,
        tokenId: 1,
        numerator: price,
        owner: owner.address,
      };

      // signTypedData 签名
      const signature = await owner._signTypedData(domain, types, value);

      // 支付ETH
      const options = { value: price };
      await nftTradePlatform
        .connect(other)
        .tradeForETH(trendyCat.address, 1, signature, value, options);
    });
  });

  describe("#tradeForToken", () => {
    it("测试用户采用USDT购买NFT函数\n", async () => {
      const types = {
        Bid: [
          { name: "_contract", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "numerator", type: "uint256" },
          { name: "owner", type: "address" },
        ],
      };

      const domain = {
        name: "Nuoibo NFT",
        version: "1",
        chainId: 31337, // hardhat测试环境链ID
        verifyingContract: nftTradePlatform.address,
      };

      const price = ethers.utils.parseEther("1");
      const value = {
        _contract: trendyCat.address,
        tokenId: 2,
        numerator: price,
        owner: owner.address,
      };

      // 设置新token地址
      await nftTradePlatform.connect(owner).setToken(usdt.address);

      // 质押NFT
      await nftTradePlatform.connect(owner).stake(trendyCat.address, 2);

      await usdt.connect(owner).transfer(other.address, price);

      await usdt.connect(other).approve(nftTradePlatform.address, price);

      // signTypedData 签名
      const signature = await owner._signTypedData(domain, types, value);

      await nftTradePlatform
        .connect(other)
        .tradeForToken(trendyCat.address, 2, signature, value);
    });
  });

  describe("#withdrawalETH", () => {
    it("测试ETH提现函数\n", async () => {
      await expect(
        nftTradePlatform.connect(other).withdrawalETH(other.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await nftTradePlatform.connect(owner).withdrawalETH(owner.address);
    });
  });

  describe("#withdrawalToken", () => {
    it("测试Token提现函数\n", async () => {
      await expect(
        nftTradePlatform.connect(other).withdrawalToken(other.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await nftTradePlatform.connect(owner).withdrawalToken(owner.address);
    });
  });

  describe("#setEmergent", () => {
    it("测试开启紧急赎回函数\n", async () => {
      await expect(
        nftTradePlatform.connect(other).setEmergent(other.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await nftTradePlatform.connect(owner).setEmergent(true);

      expect(await nftTradePlatform.connect(owner).emergent()).to.equal(true);
    });
  });


  describe("#transferOwnership", () => {
    it("测试转移权限函数\n", async () => {
      
      await nftTradePlatform.connect(owner).transferOwnership(other.address);

      expect(await nftTradePlatform.connect(owner).owner()).to.equal(other.address);
    });
  });

  describe("#renounceOwnership", () => {
    it("测试丢弃权限函数\n", async () => {
      
      await nftTradePlatform.connect(other).renounceOwnership();

      expect(await nftTradePlatform.connect(other).owner()).to.equal(zero);
    });
  });

  describe("#emergentUnstak", () => {
    it("测试紧急赎回函数\n", async () => {
      await expect(
        nftTradePlatform.connect(owner).emergentUnstak(trendyCat.address, 1)
      ).to.be.revertedWith("Permission denied");
    });
  });
});
