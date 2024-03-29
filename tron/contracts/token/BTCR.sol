pragma solidity ^0.4.24;

import "openzeppelin-contracts/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-contracts/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-contracts/contracts/token/ERC20/BurnableToken.sol";
import "openzeppelin-contracts/contracts/token/ERC20/PausableToken.sol";
import "../token/BTCrToken.sol";


contract BTCR is BTCrToken, DetailedERC20("BTC Rub", "BTCR", 8) {}

