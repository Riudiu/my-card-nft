import { ethers } from "ethers";
import { UnemployedCardNFTFactory } from "../typechain-types";
import { readFileSync } from "fs";
import { join } from "path";
const hh = require("hardhat");

// ABI 파일의 경로를 지정합니다.
const abiPath = join(
  __dirname,
  "../artifacts/contracts/UnemployedCardNFTFactory.sol/UnemployedCardNFTFactory.json"
);

// 파일을 읽어서 JSON으로 파싱합니다.
const abiJson = JSON.parse(readFileSync(abiPath, "utf8"));

// ABI 정보만 추출합니다.
const abi = abiJson.abi;

// 배포된 컨트랙트 주소
const contractAddress = "0x6F0d2D9bc7339A204B63e71b87656d189360768f";

// 명함을 주고 싶은 사람의 주소를 넣으면 됩니다
const recipientAddress = "0xE41c6b1BA58233124Df3D791bC89dDC0f83A6475";

async function main() {
  // Initialize provider and signer
  const provider = hh.ethers.provider; // Hardhat's built-in provider
  const privateKey = process.env.METAMASK_PRIVATE_KEY;

  if (!privateKey) {
    console.error("Please set the METAMASK_PRIVATE_KEY environment variable");
    process.exit(1);
  }

  const wallet = new hh.ethers.Wallet(privateKey, provider); // 연결된 프로바이더 추가
  const currentGasPrice = await provider.getGasPrice();

  const contract = new ethers.Contract(contractAddress, abi, provider).connect(
    wallet
  ) as UnemployedCardNFTFactory;

  await contract.registerUnemployedCardInfo(
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
  console.log("Unemployed Card Info Registered");

  // Mint a new UnemployedCardNFT
  await contract.mintUnemployedCardNFT({
    gasPrice: currentGasPrice.add(ethers.utils.parseUnits("1", "gwei")), // one gwei is 0.000000001 ETH.
    value: ethers.utils.parseEther("0.01"),
  });
  console.log("New UnemployedCardNFT Minted");

  // Transfer the UnemployedCardNFT to another address
  await contract.transferUnemployedCardNFT(recipientAddress);
  console.log(`UnemployedCardNFT Transferred to ${recipientAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//정상적으로 sepolia network에 배포가 되었다면 아래와 같이 출력됨.
// Unemployed Card Info Registered
// New UnemployedCardNFT Minted
// UnemployedCardNFT Transferred to 0xE41c6b1BA58233124Df3D791bC89dDC0f83A6475
