pragma solidity 0.6.4;

import "./CashAid.sol";

import "./TokenFactory.sol";

contract CashAidFactory is TokenFactory {
    event LogAgencyRegistered(address _agency);
    event LogAidCreated(CashAid _aid, string _id);
    event LogTokenReleased(uint256 indexed _phone, address indexed _agency);
    event LogTokenClaimed(
        address indexed _vendor,
        address _contract,
        uint256 indexed _phone,
        uint256 indexed _amount
    );

    //RSToken public tokenContract;
    // mapping(address => bool) public owner;

    mapping(address => mapping(string => CashAid)) public CashAids;

    constructor() public {
        // owner[msg.sender] = true;
    }

    // modifier OnlyOwner() {
    //     // require(owner[msg.sender]);
    //     // _;
    //  //   require(TokenFactory(_contractAddress) != AidToken(0));
    //     _;
    // }

    modifier OnlyAdmin {
        // require(admin[msg.sender]);
        // _;
        require(tokens[msg.sender] != AidToken(0), "account not registered");
        _;
    }

    //msg.sender on CashAid contract is this contract?
    function claimToken(
        address _contractAddress,
        uint256 _phone,
        uint256 _numberOfTokens
    ) public {
        CashAid(_contractAddress).claimTokens(_phone, _numberOfTokens);

        emit LogTokenClaimed(
            msg.sender,
            _contractAddress,
            _phone,
            _numberOfTokens
        );
    }

    //try emitting token Address
    function releaseToken(
        address _contractAddress,
        address _address,
        uint256 _phone,
        bytes32 _otpHash
    ) public OnlyOwner {
        CashAid(_contractAddress).release(_address, _phone, _otpHash);

        emit LogTokenReleased(_phone, _contractAddress);
    }

    // function registerAgency(address _address) public OnlyOwner {
    //     require(!admin[_address]);
    //     admin[_address] = true;

    //     emit LogAgencyRegistered(_address);
    // }

    function createAid(AidToken _tokenContract, string memory _id)
        public
        OnlyAdmin
    {
        require(
            CashAids[msg.sender][_id] == CashAid(0),
            "contract already deployed"
        );
        CashAids[msg.sender][_id] = new CashAid(_tokenContract, msg.sender);

        emit LogAidCreated(CashAids[msg.sender][_id], _id);
    }
}
