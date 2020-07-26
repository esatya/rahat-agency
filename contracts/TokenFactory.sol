pragma solidity 0.6.4;

import "./AidToken.sol";


contract TokenFactory {
    event LogTokenGenerated(
        AidToken _token,
        address _owner,
        string _name,
        string _symbol,
        uint256 _supply
    );

    mapping(address => bool) public owner;
    mapping(address => AidToken) public tokens;

    constructor() public {
        owner[msg.sender] = true;
    }

    modifier OnlyOwner {
        require(owner[msg.sender]);
        _;
    }

    function generateToken(
        uint256 _initialSupply,
        string memory _name,
        string memory _symbol,
        address _address
    ) public OnlyOwner {
        require(
            tokens[_address] == AidToken(0),
            "token already deployed for this address"
        );
        tokens[_address] = new AidToken(
            _initialSupply,
            _name,
            _symbol,
            _address
        );

        emit LogTokenGenerated(
            tokens[_address],
            _address,
            _name,
            _symbol,
            _initialSupply
        );
    }
}
