# 명함 NFT 개인 과제 (+ Unemployed ver.)

이 예시를 실행해보시고 싶다면 아래의 단계대로 수행해주세요. <br/>

### 패키지 설치

Visual Studio Code의 터미널을 켜고

```shell
npm i
```

<br/>

### `.env` 파일 생성후 환경변수 입력

클론받은 폴더(앞으로 이걸 root folder라고 하겠습니다.)에 `.env` 파일을 생성하고<br/>
`.env` 파일에

```shell
SEPOLIA_API_URL="Alchemy에서_발급받은_sepolia_network의_api_url"
METAMASK_PRIVATE_KEY="Metamask_private_key"
```

를 작성해줍니다.<br/>

- SEPOLIA_API_URL에는 Alchemy에서 sepolia network의 api url을 발급받으셔서 넣어주시면 됩니다.<br/>
  - https://eth-sepolia.g.alchemy.com/어쩌구~ 이런 식으로 생겼습니다.
- METAMASK_PRIVATE_KEY에는 자신의 metamask 지갑의 private key를 발급받으셔서 넣어주시면 됩니다.<br/>
  - metamask chrome extension에서 오른쪽 상단의 점 세개 > 계정 세부 정보 > show private key로 확인하실 수 있습니다.

<br/>

### `UnemployedCardNFTFactory.sol` 파일을 compile하여 `typechain-types` 폴더 생성

Visual Studio Code의 터미널에서

```shell
npx hardhat compile
```

을 해줍니다.
그러면 root folder에 `typechain-types`라는 폴더가 생성된 걸 확인하실 수 있습니다.

<br/>

### mint and trasfer 해보기

제가 이미 sepolia network에 UnemployedCardNFTFactory contract를 배포해놓은 상황입니다.(`scripts/deploy.ts`를 이용해)<br/>
그리고 그 배포한 contract 주소를 `scripts/deploy.ts`에 넣어놓았습니다.<br/>
따라서 따로 contract를 배포하실 필요는 없고 `scripts/mintAndTransfer.ts`만 실행해주시면 됩니다.<br/>
실행하는 방법은 아래와 같습니다.<br/>

Visual Studio Code의 터미널에서

```shell
npx hardhat run --network sepolia scripts/mintAndTransfer.ts
```

<br/>

### Sepolia Testnet Explorer에서 트랜잭션 내역 확인하기

[Sepolia Testnet Explorer](https://sepolia.etherscan.io, "sepolia testnet explorer link")
<br/>
여기 검색창에서 제가 배포한 컨트랙트 주소인<br/>
`0x6F0d2D9bc7339A204B63e71b87656d189360768f`<br/>
를 검색하시면 트랜잭션 내역이 뜹니다.<br/>
여기서 트랜잭션이 잘 이루어졌는지 확인하실 수 있습니다.<br/>

<br/>

자신만의 멋진 명함 NFT 컨트랙트를 새로 만드시고 싶다면  
`.sol`을 통해 새로운 컨트랙트를 작성하시고, `scripts/deploy.ts` 파일을 수정한 후  
아래 명령어로 배포하시면 됩니다.

```shell
npx hardhat run --network sepolia scripts/deploy.ts
```
