pragma solidity 0.6.4;

//uPort https://github.com/uport-project/uport-identity/blob/develop/contracts/TxRelay.sol
contract TxRelay {

    // Note:  local nonce.
    mapping(address => uint) public nonce;

    //  debug purpose
    event Log(address from, string message);

    /*
     * @dev Relays meta transactions
     * @param sigV, sigR, sigS ECDSA signature on some data to be forwarded
     * @param destination Location the meta-tx should be forwarded to
     * @param data The bytes necessary to call the function in the destination contract.
     * @param sender address of sender who originally signed data
     */
    function relayMetaTx(
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address destination,
        bytes memory data,
        address sender
    ) public {
        bool success = false;
        bytes memory returnData;

        // use EIP 191
        // 0x19 :: version :: relay :: sender :: nonce :: destination :: data
        bytes32 h = sha256(abi.encodePacked(byte(0x19), byte(0), this, sender, nonce[sender], destination, data));
        address addressFromSig = ecrecover(h, sigV, sigR, sigS);

        // address recovered from signature must match with claimed sender
        require(sender == addressFromSig);

        //if we are going to do tx, update nonce
        nonce[sender]++;

        // invoke method on behalf of sender
        //require(destination.call(data));
        (success,  returnData) = destination.call(data);
        require(success);
    }

}