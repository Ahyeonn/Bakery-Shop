//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Purchase.sol";

contract TestPurchase {
  Purchase purchase = Purchase(DeployedAddresses.Purchase());

  uint expectedPastryId = 2;

  //The expected owner of purchased pastry is this contract
  address expectedPurchaser = address(this);

    // Testing the purchase() function
  function testUserCanPurchasePastry() public {
    uint returnedId = purchase.purchase(expectedPastryId);

    Assert.equal(returnedId, expectedPastryId, "Purchase of the expected pastry should match what is returned.");
  }

  // Testing retrieval of a single pastry's owner
  function testGetPurchaserAddressByPastryId() public {
    address purchaser = purchase.purchasers(expectedPastryId);

    Assert.equal(purchaser, expectedPurchaser, "Owner of the expected pastry should be this contract");
  }

  // Testing retrieval of all pastry owners
  function testGetPurchaserAddressByPastryIdInArray() public {
    // Store purchasers in memory rather than contract's storage
    address[8] memory purchasers = purchase.getPurchasers();

    Assert.equal(purchasers[expectedPastryId], expectedPurchaser, "Owner of the expected pastry should be this contract");
  }

}
