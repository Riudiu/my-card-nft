require("dotenv").config();
import { ethers } from "hardhat";
import { UnemployedCardNFTFactory } from "../typechain-types";

async function main() {
  const UnemployedCardNFTFactory_factory = await ethers.getContractFactory(
    "UnemployedCardNFTFactory"
  );
  const unemployedCardNFTFactory: UnemployedCardNFTFactory =
    (await UnemployedCardNFTFactory_factory.deploy()) as UnemployedCardNFTFactory;

  console.log(
    "UnemployedCardNFTFactory deployed to:",
    await unemployedCardNFTFactory.address
  );
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// 정상적으로 sepolia network에 배포가 되었다면 아래와 같이 출력됨. 배포 주소는 다 다른 것이 정상.
// UnemployedCardNFTFactory deployed to: 0x6F0d2D9bc7339A204B63e71b87656d189360768f
