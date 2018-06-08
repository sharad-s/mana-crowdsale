pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "./BurnableToken.sol";

//import "./BurnableToken.sol";

contract MANAToken is BurnableToken, PausableToken, MintableToken {

  string public constant symbol = "MANA";

  string public constant name = "Decentraland MANA";

  uint8 public constant decimals = 18;

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}
