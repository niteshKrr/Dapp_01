//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Name {
    string private name;

    constructor() {
        name="Hari Om";
    }

    function get() public view returns (string memory) {
        return name;
    }

    function setGreeting(string memory _name) public {
        name = _name;
    }
}
