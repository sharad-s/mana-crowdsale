pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract TheSimplestToken is MintableToken {
    string public constant name = " TheSimplestToken ";
    string public constant symbol = "TST";
    uint32 public constant decimals = 18;
}
