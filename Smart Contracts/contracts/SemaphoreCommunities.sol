//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

/// @title Semaphore Communities contract.
/// @notice It allows users to leak information anonymously .
/// @dev The following code allows you to create entities for whistleblowers (e.g. non-profit
/// organization, newspaper) and allow them to leak anonymously.
/// Leaks can be IPFS hashes, permanent links or other kinds of references.
contract SemaphoreCommunities is SemaphoreGroups {
    error Semaphore__CallerIsNotTheEditor();
    error Semaphore__MerkleTreeDepthIsNotSupported();

    struct Verifier {
        address contractAddress;
        uint256 merkleTreeDepth;
    }

    /// @dev Emitted when a new entity is created.
    /// @param entityId: Id of the entity.
    /// @param editor: Editor of the entity.
    event EntityCreated(
        uint256 entityId,
        string groupName,
        address indexed editor
    );

    /// @dev Emitted when a whistleblower publish a new leak.
    /// @param entityId: Id of the entity.
    /// @param leak: News leak.
    event LeakPublished(uint256 indexed entityId, uint256 leak);

    ISemaphoreVerifier public verifier;

    // Generate a unique entityID
    uint256 private entityCounter;

    struct EntityInfo {
        uint idEntitiy;
        string entityName;
        address entityEditor;
    }

    // An array of 'Todo' structs
    EntityInfo[] public allEntities;

    /// @dev Gets an entity id and return its editor address.
    mapping(uint256 => address) private editors;

    /// @dev A mapping of entityIDs to group names
    mapping(uint256 => string) public entityNames;

    /// @dev Generates a unique entityID
    function generateEntityID() internal returns (uint256) {
        return ++entityCounter;
    }

    /// @dev Checks if the editor is the transaction sender.
    /// @param entityId: Id of the entity.
    modifier onlyEditor(uint256 entityId) {
        if (editors[entityId] != _msgSender()) {
            revert Semaphore__CallerIsNotTheEditor();
        }

        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    constructor(ISemaphoreVerifier _verifier) {
        verifier = _verifier;
    }

    /// @dev See {ISemaphoreWhistleblowing-createEntity}.
    function createGroup(
        string memory groupName,
        address editor,
        uint256 merkleTreeDepth
    ) public {
        uint256 entityId = generateEntityID();

        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }

        _createGroup(entityId, merkleTreeDepth);

        editors[entityId] = editor;
        entityNames[entityId] = groupName;

        // key value mapping
        allEntities.push(
            EntityInfo({
                idEntitiy: entityId,
                entityName: groupName,
                entityEditor: editor
            })
        );

        emit EntityCreated(entityId, groupName, editor);
    }

    /// @dev See {ISemaphoreWhistleblowing-addWhistleblower}.
    function addWhistleblower(
        uint256 entityId,
        uint256 identityCommitment
    ) public onlyEditor(entityId) {
        _addMember(entityId, identityCommitment);
    }

    /// @dev See {ISemaphoreWhistleblowing-removeWhistleblower}.
    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) public onlyEditor(entityId) {
        _removeMember(
            entityId,
            identityCommitment,
            proofSiblings,
            proofPathIndices
        );
    }

    /// @dev See {ISemaphoreWhistleblowing-publishLeak}.
    function publishLeak(
        uint256 leak,
        uint256 nullifierHash,
        uint256 entityId,
        uint256[8] calldata proof
    ) public {
        uint256 merkleTreeDepth = getMerkleTreeDepth(entityId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(entityId);

        verifier.verifyProof(
            merkleTreeRoot,
            nullifierHash,
            leak,
            entityId,
            proof,
            merkleTreeDepth
        );

        emit LeakPublished(entityId, leak);
    }

    // /// @dev Gets the number of entities.
    function getNumberOfEntities() public view returns (uint) {
        return allEntities.length;
    }

    /// @dev Updates the Name of the Group/Entity.
    /// @param _index: Location of the Entity in the allEntities array.
    /// @param _groupName: New group name.
    function updateGroupName(
        uint256 _index,
        string calldata _groupName,
        uint256 entityId
    ) public onlyEditor(entityId) {
        EntityInfo storage entityInfo = allEntities[_index];
        entityInfo.entityName = _groupName;
        entityNames[entityId] = _groupName;
    }

    /// @dev Updates the Editor of the Group/Entity.
    /// @param _index: Location of the Entity in the allEntities array.
    /// @param _newEditor: New editor address.
    function updateGroupEditor(
        uint256 _index,
        address _newEditor,
        uint256 entityId
    ) public onlyEditor(entityId) {
        EntityInfo storage entityInfo = allEntities[_index];
        entityInfo.entityEditor = _newEditor;
        editors[entityId] = _newEditor;
    }
}
