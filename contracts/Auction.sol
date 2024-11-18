// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract Auction {
    string auctionId;
    address consignorId;
    bool isClosed = false;

    mapping (address => string) commitmentList;

    constructor(string memory _auctionId) {
        auctionId = _auctionId;
        consignorId = msg.sender;
    }

    function getProductId() public view returns (string memory) {
        return auctionId;
    }

    function getConsignorId() public view returns (address) {
        return consignorId;
    }

    function getIsClosed() public view returns (bool) {
        return isClosed;
    }

    function bid(string memory commitment) public {
        require(!isClosed, "Auction closed");
        require(msg.sender != consignorId, "Consignor cannot make a bid");
        commitmentList[msg.sender] = commitment;
    }

    function getCommitment(address bidder) public view returns (string memory) {
        return commitmentList[bidder];
    }

    function closeAuction() public {
        require(msg.sender == consignorId, "Only the consignor can close the auction");
        isClosed = true;
    }
}