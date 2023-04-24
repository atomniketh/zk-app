//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Feedback is Pausable, Ownable {
    ISemaphore public semaphore;
    uint256 public groupId;
    string groupName;

    // @dev Setting the initial groupID to 55555500000 to avoid conflicts
    // with the SemaphoreGroups contract uncertainty in which IDs
    // are already in use.
    // @param Generate a unique groupID
    uint256 private groupCounter = 55555500000;

    /// @dev A mapping of groupIDs to group names
    mapping(uint256 => string) public groupNames;

    /// @dev Generates a unique groupID
    function generateGroupID() internal returns (uint256) {
        return ++groupCounter;
    }

    constructor(address semaphoreAddress, string memory _groupName) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = generateGroupID();
        groupNames[groupId] = _groupName;
        semaphore.createGroup(groupId, 20, address(this));
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function createNewGroup(string memory _groupName) external {
        groupId = generateGroupID();
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
        semaphore.verifyProof(
            _groupID,
            merkleTreeRoot,
            feedback,
            nullifierHash,
            _groupID,
            proof
        );
    }

    /// @dev Updates the Semaphore Contract.
    /// Only the contract admin can call this function.
    /// @param _newSemaphoreContract: Address from the Semaphore.sol row
    /// located at https://semaphore.appliedzkp.org/docs/deployed-contracts#semaphore
    function updateSemaphoreContract(
        address _newSemaphoreContract
    ) public onlyOwner {
        semaphore = ISemaphore(_newSemaphoreContract);
    }

    /// @dev Updates the Name of the Group.
    /// @param _groupName: New group name.
    function updateGroupName(
        string calldata _groupName,
        uint256 _groupID
    ) public onlyOwner {
        groupNames[_groupID] = _groupName;
    }
}
