"use client";

import React from "react";
import { ethers } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";
import Button from "../Shared/Button"; // Assuming Button is your custom button component

const AttestationButton = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const handleAttest = async () => {
    if (!signer || !address || !chain) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const chainId = chain.id;

      if (chainId === 84532) {
        // Chain ID 84532: Call attest as per usual

        // Replace with your Sign Protocol contract address on chain 84532
        const signProtocolContractAddress = "0xYourSignProtocolContractAddress"; // TODO: Replace with actual address

        // ABI of the Sign Protocol contract's attest function
        const signProtocolABI = [
          // Include the ABI of the attest function
          "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes) external payable returns (uint64)",
        ];

        const contract = new ethers.Contract(
          signProtocolContractAddress,
          signProtocolABI,
          signer
        );

        // Prepare the attestation parameters
        const attestation = {
          schemaId: 1, // Replace with actual schemaId
          linkedAttestationId: 0,
          attestTimestamp: 0, // Will be set in contract
          revokeTimestamp: 0,
          attester: address,
          validUntil: 0,
          dataLocation: 1, // Assuming DataLocation.OnChain is 1
          revoked: false,
          recipients: [address],
          data: ethers.utils.toUtf8Bytes("Your attestation data"),
        };

        const indexingKey = "";
        const delegateSignature = "0x";
        const extraData = "0x";

        // Call the attest function
        const tx = await contract.attest(
          attestation,
          indexingKey,
          delegateSignature,
          extraData
        );

        // Wait for the transaction to be mined
        await tx.wait();

        console.log("Attestation successful on chain 84532");
      } else {
        // Other chain: Call dispatchAttestation

        // Replace with your AttestationDispatcher contract address on the current chain
        const attestationDispatcherAddress =
          "0xYourAttestationDispatcherAddress"; // TODO: Replace with actual address

        // ABI of the AttestationDispatcher contract
        const attestationDispatcherABI = [
          "function dispatchAttestation(uint256 action, bytes attestationData) external payable",
        ];

        const contract = new ethers.Contract(
          attestationDispatcherAddress,
          attestationDispatcherABI,
          signer
        );

        // Prepare action and attestationData
        const action = 0; // Adjust as needed

        // Prepare the attestation data to be sent
        const schemaId = 1; // Replace with actual schemaId
        const contractDetails = "Your contract details";
        const signerAddress = address;
        const indexingKey = "";
        const extraData = ethers.utils.toUtf8Bytes("Your extra data");

        const attestationData = ethers.utils.defaultAbiCoder.encode(
          ["uint64", "string", "address", "string", "bytes"],
          [schemaId, contractDetails, signerAddress, indexingKey, extraData]
        );

        // Send the transaction
        const tx = await contract.dispatchAttestation(action, attestationData, {
          value: ethers.utils.parseEther("0"),
        });

        await tx.wait();

        console.log("Attestation dispatched via Hyperlane");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred. See console for details.");
    }
  };

  return (
    <Button label="Submit Attestation" onClick={handleAttest}></Button>
  );
};

export default AttestationButton;
