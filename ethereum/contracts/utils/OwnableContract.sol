pragma solidity 0.4.24;

import "openzeppelin-contracts/contracts/ownership/Claimable.sol";
import "openzeppelin-contracts/contracts/ownership/CanReclaimToken.sol";


// empty block is used as this contract just inherits others.
contract OwnableContract is CanReclaimToken, Claimable { } /* solhint-disable-line no-empty-blocks */
