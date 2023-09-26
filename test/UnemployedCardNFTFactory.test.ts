import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { UnemployedCardNFTFactory } from "../typechain-types";

describe("UnemployedCardNFTFactory", () => {
  let unemployedCardNFTFactory: UnemployedCardNFTFactory;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  // deploy test
  beforeEach(async () => {
    const UnemployedCardNFTFactory_factory = await ethers.getContractFactory(
      "UnemployedCardNFTFactory"
    );
    unemployedCardNFTFactory =
      (await UnemployedCardNFTFactory_factory.deploy()) as UnemployedCardNFTFactory;
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Register Unemployed Card Info", () => {
    it("Should register Unemployed card info", async () => {
      await unemployedCardNFTFactory
        .connect(addr1)
        .registerUnemployedCardInfo(
          "Jiwoo Yun",
          "2001.05.14",
          "lacvert13@gmail.com",
          "010-1234-5678",
          "Reading books, Watching movies",
          "TopGun, Titanic, Fast & Furious",
          "FootBall",
          "riudiux",
          "Riudiu",
          "riudiux"
        );
      const myCardInfo = await unemployedCardNFTFactory.getUnemployedCardInfo(
        await addr1.getAddress()
      );
      expect(myCardInfo.name).to.equal("Jiwoo Yun");
    });
  });

  describe("Minting and Transferring", () => {
    it("Should mint a new UnemployedCardNFT", async () => {
      await unemployedCardNFTFactory
        .connect(addr1)
        .registerUnemployedCardInfo(
          "Jiwoo Yun",
          "2001.05.14",
          "lacvert13@gmail.com",
          "010-1234-5678",
          "Reading books, Watching movies",
          "TopGun, Titanic, Fast & Furious",
          "FootBall",
          "riudiux",
          "Riudiu",
          "riudiux"
        );
      await unemployedCardNFTFactory.connect(addr1).mintUnemployedCardNFT();
      expect(
        await unemployedCardNFTFactory.balanceOf(await addr1.getAddress())
      ).to.equal(1);
    });

    it("Should transfer a new UnemployedCardNFT", async () => {
      await unemployedCardNFTFactory
        .connect(addr1)
        .registerUnemployedCardInfo(
          "Jiwoo Yun",
          "2001.05.14",
          "lacvert13@gmail.com",
          "010-1234-5678",
          "Reading books, Watching movies",
          "TopGun, Titanic, Fast & Furious",
          "FootBall",
          "riudiux",
          "Riudiu",
          "riudiux"
        );
      await unemployedCardNFTFactory
        .connect(addr1)
        .mintUnemployedCardNFT({ value: ethers.utils.parseEther("0.01") });
      await unemployedCardNFTFactory
        .connect(addr1)
        .transferUnemployedCardNFT(await addr2.getAddress());

      expect(
        await unemployedCardNFTFactory.balanceOf(await addr2.getAddress())
      ).to.equal(1);

      expect(
        await unemployedCardNFTFactory.getAmountOfTokenOwnedByIssuer(
          await addr1.getAddress()
        )
      ).to.equal(0);
      expect(
        await unemployedCardNFTFactory.balanceOf(await addr1.getAddress())
      ).to.equal(0);
    });
  });
});
