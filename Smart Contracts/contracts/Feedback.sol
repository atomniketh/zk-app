//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Feedback {
    ISemaphore public semaphore;
    uint256 public groupId;
    string groupName;

    constructor(address semaphoreAddress, uint256 _groupId, string memory _groupName) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;
        groupName = _groupName;
        semaphore.createGroup(groupId, 20, address(this));
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function sendFeedback(
        uint256 feedback,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, feedback, nullifierHash, groupId, proof);
    }
}