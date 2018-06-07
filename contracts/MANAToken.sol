pragma solidity ^0.4.23;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract MANAToken is StandardToken {
  string public constant name = "MANA Token";
  string public constant symbol = "MANA";
  uint8 public constant decimals = 18;

  constructor (uint256 _totalSupply) {
   totalSupply_ = _totalSupply;
}

}
