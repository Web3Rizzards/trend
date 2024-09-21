// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import { ISPHook } from "../lib/sign-protocol-evm/src/interfaces/ISPHook.sol";
import { ISP } from "../lib/sign-protocol-evm/src/interfaces/ISP.sol";
import { Attestation } from "../lib/sign-protocol-evm/src/models/Attestation.sol";
import { IWorldID } from "../src/interfaces/IWorldID.sol";
import { ByteHasher } from "../src/helpers/ByteHasher.sol";
import { WorldIDSchemaHook } from "../src/WorldIdSchemaHook.sol";

contract MockWorldID is IWorldID {
    using ByteHasher for bytes;

    uint256 public immutable groupId = 1;
    mapping(uint256 => bool) public validNullifiers;

    function verifyProof(
        uint256 root,
        uint256 groupId_,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external view override {
        // Simulate successful verification if the nullifierHash is in validNullifiers
        require(groupId_ == groupId, "Invalid groupId");
        require(validNullifiers[nullifierHash], "Invalid proof");
    }

    function setValidNullifier(uint256 nullifierHash, bool isValid) external {
        validNullifiers[nullifierHash] = isValid;
    }
}

contract MockISP is ISP {
    mapping(uint64 => Attestation) public attestations;

    function getAttestation(uint64 attestationId)
        external
        view
        override
        returns (Attestation memory)
    {
        return attestations[attestationId];
    }

    function createAttestation(
        address attester,
        uint64 schemaId,
        bytes memory data
    ) external returns (uint64 attestationId) {
        attestationId = uint64(uint256(keccak256(abi.encodePacked(attester, schemaId, data))));
        attestations[attestationId] = Attestation({
            attester: attester,
            schemaId: schemaId,
            time: uint64(block.timestamp),
            data: data
        });
    }
}

contract WorldIDSchemaHookTest is Test {
    using ByteHasher for bytes;

    WorldIDSchemaHook public schemaHook;
    MockWorldID public worldId;
    MockISP public signProtocol;
    address public attester;
    address public otherUser;

    string public appId = "app_staging_123456789abcdef";
    string public actionId = "attestation_creation";
    uint256 public externalNullifier;

    function setUp() public {
        // Deploy Mock WorldID contract
        worldId = new MockWorldID();

        // Compute externalNullifier
        externalNullifier = abi
            .encodePacked(keccak256(abi.encodePacked(appId)), actionId);

        // Deploy the Schema Hook contract
        schemaHook = new WorldIDSchemaHook(
            IWorldID(address(worldId)),
            appId,
            actionId
        );

        // Deploy Mock Sign Protocol contract
        signProtocol = new MockISP();

        // Assign addresses
        attester = address(0x1);
        otherUser = address(0x2);

        // Label addresses for better debugging
        vm.label(attester, "Attester");
        vm.label(otherUser, "OtherUser");
        vm.label(address(worldId), "WorldID");
        vm.label(address(schemaHook), "SchemaHook");
        vm.label(address(signProtocol), "SignProtocol");
    }

    function testSuccessfulVerification() public {
        // Prepare mock data
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

        // Prepare WorldID verification parameters
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 1, 2, 3, 4, 5, 6, 7];

        // Set the nullifierHash as valid in the mock WorldID contract
        worldId.setValidNullifier(nullifierHash, true);

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Call the didReceiveAttestation function
        vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
        schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);

        // If no revert, test passes
        assertTrue(true);
    }

    function testFailedVerification() public {
        // Prepare mock data
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

        // Prepare WorldID verification parameters
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 1, 2, 3, 4, 5, 6, 7];

        // Do NOT set the nullifierHash as valid in the mock WorldID contract

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Expect revert with WorldIDVerificationFailed
        vm.expectRevert(WorldIDSchemaHook.WorldIDVerificationFailed.selector);

        // Call the didReceiveAttestation function
        vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
        schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);
    }

    function testInvalidProof() public {
        // Prepare mock data
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

        // Prepare WorldID verification parameters with invalid proof
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 0, 0, 0, 0, 0, 0, 0]; // Invalid proof

        // Set the nullifierHash as valid in the mock WorldID contract
        worldId.setValidNullifier(nullifierHash, true);

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Expect revert with WorldIDVerificationFailed
        vm.expectRevert(WorldIDSchemaHook.WorldIDVerificationFailed.selector);

        // Call the didReceiveAttestation function
        vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
        schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);
    }

    function testInvalidExtraData() public {
        // Prepare mock data
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

        // Prepare invalid extraData (missing proof)
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));

        // Encode invalid extraData
        bytes memory extraData = abi.encode(root, nullifierHash); // Missing proof

        // Expect revert due to decoding error
        vm.expectRevert();

        // Call the didReceiveAttestation function
        vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
        schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);
    }

    function testUnauthorizedCaller() public {
        // Prepare mock data
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

        // Prepare WorldID verification parameters
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 1, 2, 3, 4, 5, 6, 7];

        // Set the nullifierHash as valid in the mock WorldID contract
        worldId.setValidNullifier(nullifierHash, true);

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Expect the function to fail because the caller is not the Sign Protocol contract
        vm.expectRevert();

        // Call the didReceiveAttestation function without using the Sign Protocol contract
        schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);
    }

    function testMultipleAttestations() public {
        // Prepare WorldID verification parameters
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 1, 2, 3, 4, 5, 6, 7];

        // Set the nullifierHash as valid in the mock WorldID contract
        worldId.setValidNullifier(nullifierHash, true);

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Create and verify multiple attestations
        for (uint256 i = 0; i < 5; i++) {
            uint64 schemaId = uint64(i + 1);
            bytes memory data = abi.encodePacked("Test Data ", i);
            uint64 attestationId = signProtocol.createAttestation(attester, schemaId, data);

            // Call the didReceiveAttestation function
            vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
            schemaHook.didReceiveAttestation(attester, schemaId, attestationId, extraData);
        }

        // If no revert, test passes
        assertTrue(true);
    }

    function testOtherUserAttestation() public {
        // Prepare mock data for other user
        uint64 schemaId = 1;
        bytes memory data = "Test Attestation Data";
        uint64 attestationId = signProtocol.createAttestation(otherUser, schemaId, data);

        // Prepare WorldID verification parameters for attester (not otherUser)
        uint256 root = 12345;
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(attester)));
        uint256[8] memory proof = [uint256(0), 1, 2, 3, 4, 5, 6, 7];

        // Set the nullifierHash as valid in the mock WorldID contract
        worldId.setValidNullifier(nullifierHash, true);

        // Encode extraData
        bytes memory extraData = abi.encode(root, nullifierHash, proof);

        // Expect revert with WorldIDVerificationFailed because the signal (otherUser) doesn't match the proof
        vm.expectRevert(WorldIDSchemaHook.WorldIDVerificationFailed.selector);

        // Call the didReceiveAttestation function with otherUser as attester
        vm.prank(address(signProtocol)); // Simulate call from Sign Protocol contract
        schemaHook.didReceiveAttestation(otherUser, schemaId, attestationId, extraData);
    }
}
