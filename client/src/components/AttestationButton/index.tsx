import React from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import Button from "../Shared/Button";
import { parseAbi } from "viem";

const DISPATCHER_ADDRESS = "0x790d846ad311772E311B1C7525ba07A799535dd2";
const SIGN_ADDRESS = "0x935588C6018925E659847b07891A62CdA5054B2d";

const AttestationButton = () => {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleAttest = async () => {
    if (!walletClient || !address || !chainId) {
      console.error("Wallet not connected");
      return;
    }

    try {
      if (chainId === 84532) {
        // Chain ID 84532: Call attest as per usual

        // Replace with your Sign Protocol contract address on chain 84532
        const signProtocolContractAddress = SIGN_ADDRESS;

        // ABI of the Sign Protocol contract's attest function
        const signProtocolABI = parseAbi([
          // Include the ABI of the attest function
          "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes) external payable returns (uint64)",
        ]);
        //
        // Prepare the attestation parameters
        const attestation1 = {
          schemaId: BigInt(1), // Replace with actual schemaId
          linkedAttestationId: BigInt(0),
          attestTimestamp: BigInt(0), // Will be set in contract
          revokeTimestamp: BigInt(0),
          // attester: address,
          // validUntil: 0,
          // dataLocation: 1, // Assuming DataLocation.OnChain is 1
          // revoked: false,
          // recipients: [address],
          // data: ethers.toUtf8Bytes("Your attestation data"),
        };

        const attestation = [
          BigInt(1),
          BigInt(1),
          BigInt(1),
          BigInt(1),
          address,
          BigInt(1),
          1,
          false,
          [address],
          ethers.toUtf8Bytes("Your attestation data"),
        ];

        const indexingKey = "";
        const delegateSignature = "0x";
        const extraData = "0x";

        const { request } = await publicClient!.simulateContract({
          account: address,
          address: signProtocolContractAddress,
          abi: signProtocolABI,
          functionName: "attest",
          args: [attestation as any, indexingKey, delegateSignature, extraData],
        });
        const tx = await walletClient.writeContract(request);

        // Wait for the transaction to be mined
        // await tx.wait();

        console.log("Attestation successful on chain 84532");
      } else {
        // Other chain: Call dispatchAttestation

        // Replace with your AttestationDispatcher contract address on the current chain
        const attestationDispatcherAddress = DISPATCHER_ADDRESS;

        // ABI of the AttestationDispatcher contract
        const attestationDispatcherABI = [
          "function dispatchAttestation(uint256 action, bytes attestationData) external payable",
        ];

        // Prepare action and attestationData
        const action = 0; // Adjust as needed

        // Prepare the attestation data to be sent
        const schemaId = 1; // Replace with actual schemaId
        const contractDetails = "Your contract details";
        const signerAddress = address;
        const indexingKey = "";
        const extraData = ethers.toUtf8Bytes("Your extra data");

        const abiCoder = new ethers.AbiCoder();

        const attestationData = abiCoder.encode(
          ["uint64", "string", "address", "string", "bytes"],
          [schemaId, contractDetails, signerAddress, indexingKey, extraData]
        );

        const { request } = await publicClient!.simulateContract({
          account: address,
          address: attestationDispatcherAddress,
          abi: attestationDispatcherABI,
          functionName: "dispatchAttestation",
          args: [action, attestationData],
        });
        const tx = await walletClient.writeContract(request);

        // await tx.wait();

        console.log("Attestation dispatched via Hyperlane");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred. See console for details.");
    }
  };

  return <Button label="Submit Attestation" onClick={handleAttest}></Button>;
};

export default AttestationButton;
