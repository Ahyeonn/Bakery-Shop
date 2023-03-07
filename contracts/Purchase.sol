//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Purchase {
    address[8] public purchasers;

    // Purchasing a pastry
    function purchase(uint pastryId) public returns (uint) {
        require(pastryId >= 0 && pastryId <= 8);

        purchasers[pastryId] = msg.sender;

        return pastryId;
    }

    // Retrieving the purchasers
    function getPurchasers() public view returns (address[8] memory) {
        return purchasers;
    }


}
