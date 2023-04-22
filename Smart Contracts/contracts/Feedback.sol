//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Feedback {
    ISemaphore public semaphore;
    uint256 public groupId;
    string groupName;

    // @dev Setting the initial entityID to 55555500000 to avoid conflicts 
    // with the SemaphoreGroups contract uncertainty in which IDs 
    // are already in use.
    // @param Generate a unique entityID
    uint256 private entityCounter = 55555500000;
    
    /// @dev A mapping of entityIDs to group names
    mapping(uint256 => string) public groupNames;
    
    /// @dev Generates a unique entityID
    function generateEntityID() internal returns (uint256) {
        return ++entityCounter;
    }

    constructor(address semaphoreAddress, string memory _groupName) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = generateEntityID();
        groupNames[groupId] = _groupName;
        semaphore.createGroup(groupId, 20, address(this));
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function createNewGroup(string memory _groupName) external {
        groupId = generateEntityID();
        groupNames[groupId] = _groupName;
        semaphore.createGroup(groupId, 20, address(this));
    }

    function sendFeedback(
        uint256 feedback,
        uint256 _groupID,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(_groupID, merkleTreeRoot, feedback, nullifierHash, _groupID, proof);
    }
}