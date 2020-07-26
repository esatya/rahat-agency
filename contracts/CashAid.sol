pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "./AidToken.sol";

contract CashAid {
    event LogClaimed(address, uint256 indexed _phone, uint256 _amount);
    event LogReleased(uint256 _phone, uint256 _amount);
    event LogIssued(uint256 _phone, uint256 _amount);

    mapping(address => bool) public admin;
    AidToken public tokenContract;

    mapping(uint256 => bool) public beneficiaries;
    mapping(address => bool) public vendors;

    enum Status {open, released, closed}

    struct claim {
        uint256 amount;
        bytes32 otpHash;
        Status status;
        uint256 expiryDate;
    }
    address public factory;

    mapping(address => mapping(uint256 => claim)) public allClaims;

    mapping(uint256 => uint256) public claimables;
    uint256 totalIssuedTokens;

    constructor(AidToken _tokenContract, address _caller) public {
        admin[msg.sender] = true;
        admin[_caller] = true;
        factory = msg.sender;
        tokenContract = _tokenContract;
    }

    modifier OnlyFactory() {
        require(msg.sender == factory, "You need to use the factory");
        _;
    }
    modifier OnlyAdmin {
        require(admin[msg.sender], "Only Admin can execute this transaction");
        _;
    }

    modifier OnlyVendor {
        require(
            vendors[tx.origin],
            "Only vendors can exexute this transaction"
        );
        _;
    }

    function addAdmin(address _address) public OnlyAdmin {
        admin[_address] = true;
    }

    // function beneficiary(uint256 _phone)  public OnlyAdmin {
    //     require(!beneficiaries[_phone],"already registered as beneficiary");
    //     beneficiaries[_phone] = true;
    // }

    function vendor(address _address) public {
        require(!vendors[_address], "already registered as vendor");
        vendors[_address] = true;
    }

    function issue(uint256 _phone, uint256 _amount) public OnlyAdmin {
        require(
            tokenContract.balanceOf(address(this)) >=
                _amount + totalIssuedTokens,
            "not enough token to issue"
        );
        //require(beneficiaries[_phone],"phone not registered as beneficiary");
        claimables[_phone] += _amount;
        totalIssuedTokens += _amount;

        emit LogIssued(_phone, _amount);
    }

    function issueBulk(uint256[] memory _phone, uint256[] memory _amount)
        public
        OnlyAdmin
    {
        uint256 i;
        uint256 sum = getArraySum(_amount);

        require(
            tokenContract.balanceOf(address(this)) >= sum + totalIssuedTokens,
            "not enough token to issue"
        );

        for (i = 0; i < _phone.length; i++) {
            claimables[_phone[i]] += _amount[i];
            totalIssuedTokens += _amount[i];
        }
    }

    //change otp to bytes 32 => store hash only
    function claimTokens(uint256 _phone, uint256 _numberOfTokens)
        public
        OnlyVendor
    {
        require(
            claimables[_phone] >= _numberOfTokens,
            "number of tokens is greater than claimable."
        );
        require(
            allClaims[tx.origin][_phone].expiryDate <= block.timestamp,
            "claim pending"
        );

        claim storage ac = allClaims[tx.origin][_phone];
        ac.amount = _numberOfTokens;
        ac.status = Status.open;
        ac.expiryDate = block.timestamp + 300;

        emit LogClaimed(tx.origin, _phone, _numberOfTokens);
    }

    //onlyfactory can release;
    function release(
        address _address,
        uint256 _phone,
        bytes32 _otpHash
    ) public OnlyFactory {
        require(
            allClaims[_address][_phone].expiryDate >= block.timestamp,
            "claim expired"
        );
        claim storage ac = allClaims[_address][_phone];
        ac.otpHash = _otpHash;
        ac.status = Status.released;
        emit LogReleased(_phone, allClaims[_address][_phone].amount);
    }

    function getTokens(uint256 _phone, string memory _otp)
        public
        OnlyVendor
        returns (bytes32 interal_otp, bytes32 extern_otp)
    {
        claim storage ac = allClaims[msg.sender][_phone];
        bytes32 otpHash = findHash(_otp);
        require(ac.expiryDate >= block.timestamp, "otp expired");
        require(uint256(ac.status) == 1, "claim was not released yet.");
        require(
            uint256(ac.status) != 2,
            "no pending claims for current phone number"
        );
        require(
            allClaims[msg.sender][_phone].otpHash == otpHash,
            "otp did not match"
        );
        require(
            tokenContract.balanceOf(address(this)) >= ac.amount,
            "not enough balance"
        );
        require(
            tokenContract.transfer(msg.sender, ac.amount),
            "internal error:cannot transfer token"
        );

        claimables[_phone] -= ac.amount;
        ac.status = Status.closed;
        ac.expiryDate = block.timestamp;
        totalIssuedTokens -= ac.amount;

        return (otpHash, allClaims[msg.sender][_phone].otpHash);
    }

    function findHash(string memory _pin) private pure returns (bytes32) {
        return sha256(abi.encodePacked(_pin));
    }

    function getArraySum(uint256[] memory _array)
        public
        pure
        returns (uint256 sum)
    {
        sum = 0;
        for (uint256 i = 0; i < _array.length; i++) {
            sum += _array[i];
        }
        return sum;
    }

    function close() public OnlyAdmin {
        tokenContract.transfer(
            msg.sender,
            tokenContract.balanceOf(address(this))
        );
        // selfdestruct(msg.sender);
    }
}
