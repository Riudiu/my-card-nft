// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//Errors
error No_Unemployed_Card_NFTs_To_Transfer();

contract UnemployedCardNFTFactory is ERC721 {
   
    uint public tokenId;

    struct UnemployedCardInfo {
        //essential
        string name;
        string birth;
        string email;
        address issuer; //발급한 사람. 즉 명함 정보의 주인

        //optional
        string phone;
        string hobby;
        string favoriteMovie;
        string favoriteSport;
        string instagramID;
        string githubID;
        string twitterID;
    }

    constructor() ERC721("unemployedCardNFT", "UECard") {}

    modifier isUnemployedCardInfoRegistered(){
        UnemployedCardInfo memory myCardInfo = _infos[msg.sender];
        require(
            keccak256(abi.encodePacked(myCardInfo.name)) != keccak256(abi.encodePacked("")),
            "Register your Unemployed Card info First"
        );
        _;
    }

    mapping(address  => UnemployedCardInfo ) private _infos; //issuer가 발급한 명함 정보
    mapping(address => uint[]) private _tokenIdsMadeByIssuer;  //issuer가 발급한 명함의 tokenId들
    mapping(address => mapping(uint=> bool)) private _isTokenStillOwnedByIssuer; //issuer가 발급한 tokenId들이 현재 issuer에게 있는지. 있으면 true, 없으면 false
    mapping(uint => address) private _issuerOfToken; //tokenId의 issuer
    mapping(address => uint) private _amountOfTokenOwnedByIssuer; //issuer가 현재 가지고 있는 자신의 명함 개수(발급한 양 - 남들에게 transfer한 양) //ERC721의 _balances는 자신의 명함 개수 뿐만 아니라 자신이 받은 명함 개수까지 value값으로 가진다는 점에서 이 mapping과 차이점을 가짐. 

     //Events
    event UnemployedCardInfoRegistered(
        address indexed issuer,
        string name,
        string birth,
        string email,
        string phone,
        string hobby,
        string favoriteMovie,
        string favoriteSport,
        string instagramID,
        string githubID,
        string twitterID
    );
    event UnemployedCardNFTMinted(
        uint indexed tokenId,
        address issuer,
        uint amountOfTokenOwnedByIssuer
    );
    event UnemployedCardNFTTransfered(
        address indexed to,
        address from,
        uint tokenId,
        uint amountOfTokenOwnedByIssuer
    );

    //Functions
    function registerUnemployedCardInfo (//자신의 명함 NFT 정보 작성
        string memory _name,
        string memory _birth,
        string memory _email,
        string memory _phone,
        string memory _hobby,
        string memory _favoriteMovie,
        string memory _favoriteSport,
        string memory _instagramID,
        string memory _githubID,
        string memory _twitterID
    ) public {
        UnemployedCardInfo memory myCardInfo = UnemployedCardInfo({
            issuer: msg.sender,
            name: _name,
            birth: _birth,
            email: _email,
            phone:_phone,
            hobby: _hobby,
            favoriteMovie:_favoriteMovie,
            favoriteSport:_favoriteSport,
            instagramID:_instagramID,
            githubID:_githubID,
            twitterID:_twitterID
        });
               
        _infos[msg.sender] = myCardInfo;

        emit UnemployedCardInfoRegistered(msg.sender, _name, _birth, _email, _phone, _hobby, _favoriteMovie, _favoriteSport, _instagramID, _githubID, _twitterID);
    } 

    function mintUnemployedCardNFT () public payable isUnemployedCardInfoRegistered{ //자신의 명함 NFT 한 개 발급      
        tokenId++;
        
        _mint(msg.sender, tokenId);
 
        //tokenIds 관련 매핑 업데이트
        uint[] storage tokenIdsMadeByIssuer = _tokenIdsMadeByIssuer[msg.sender];
        tokenIdsMadeByIssuer.push(tokenId);
        _isTokenStillOwnedByIssuer[msg.sender][tokenId] = true;
        _issuerOfToken[tokenId] = msg.sender;      
        _amountOfTokenOwnedByIssuer[msg.sender]++;

        emit UnemployedCardNFTMinted(tokenId,msg.sender, _amountOfTokenOwnedByIssuer[msg.sender]);
    }

    function transferUnemployedCardNFT (address to) public isUnemployedCardInfoRegistered{
        require(_amountOfTokenOwnedByIssuer[msg.sender]!=0,"Mint your Unemployed Card NFT first");

        uint _tokenIdToTransfer;
        uint[] memory tokenIdsMadeByIssuer =_tokenIdsMadeByIssuer[msg.sender];
        for (uint i=0;i<tokenIdsMadeByIssuer.length;i++) {
            uint _tokenIdMadeByIssuer = tokenIdsMadeByIssuer[i];
            if (_isTokenStillOwnedByIssuer[msg.sender][_tokenIdMadeByIssuer]==true) {
                _tokenIdToTransfer = _tokenIdMadeByIssuer;
                break;
            }
            if ((i==tokenIdsMadeByIssuer.length-1)&&(_isTokenStillOwnedByIssuer[msg.sender][_tokenIdMadeByIssuer]==false)){
                revert No_Unemployed_Card_NFTs_To_Transfer();
            }
        }

        safeTransferFrom(msg.sender, to, _tokenIdToTransfer);

        //tokenIds 관련 매핑 업데이트
        _isTokenStillOwnedByIssuer[msg.sender][_tokenIdToTransfer]= false;
        _amountOfTokenOwnedByIssuer[msg.sender] --;

        emit UnemployedCardNFTTransfered(to, msg.sender, _tokenIdToTransfer, _amountOfTokenOwnedByIssuer[msg.sender]);
    }

    //getter Funtions
    function getUnemployedCardInfo(address issuer) external view returns (UnemployedCardInfo memory){
        return _infos[issuer];
    }
    function getAmountOfTokenOwnedByIssuer(address issuer) external view returns (uint){
        return _amountOfTokenOwnedByIssuer[issuer];
    }
}