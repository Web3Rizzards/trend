import React from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import Button from "../Shared/Button";
import { parseAbi, stringToBytes } from "viem";
import { lineaSepolia, morphHolesky, morphSepolia } from "viem/chains";

const SIGN_ADDRESS = "0x935588C6018925E659847b07891A62CdA5054B2d";

const getDispatcherAddressSet = (chainId: number) => {
  switch (chainId) {
    case morphHolesky.id:
      return "0x790d846ad311772E311B1C7525ba07A799535dd2";
    case lineaSepolia.id:
      return "0x9FBbe7d77D6283f9a32f6C5d0dc65f1220F34083";
    default:
      return "";
  }
};

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
        const signProtocolContractAddress = SIGN_ADDRESS;

        const signProtocolABI = parseAbi([
          "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes) external payable returns (uint64)",
        ]);

        // Prepare the attestation parameters
        // const attestation1 = {
        //   schemaId: BigInt(1), // Replace with actual schemaId
        //   linkedAttestationId: BigInt(0),
        //   attestTimestamp: BigInt(0), // Will be set in contract
        //   revokeTimestamp: BigInt(0),
        //   attester: address,
        //   validUntil: BigInt(0),
        //   dataLocation: 1, // Assuming DataLocation.OnChain is 1
        //   revoked: false,
        //   recipients: [address],
        //   data: stringToBytes("Your attestation data"),
        // };

        const attestation = [
          BigInt(1),
          BigInt(0),
          BigInt(0),
          BigInt(0),
          address,
          BigInt(0),
          1,
          false,
          [address],
          stringToBytes("Your attestation data"),
        ];

        const indexingKey = "trend_post";
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
        const _currDispatcherAddr = getDispatcherAddressSet(chainId);
        if (!_currDispatcherAddr) return;
        // Other chain: Call dispatchAttestation

        // Replace with your AttestationDispatcher contract address on the current chain

        // ABI of the AttestationDispatcher contract
        const attestationDispatcherABI = parseAbi([
          "function dispatchAttestation(uint256 action, bytes attestationData) external payable",
        ]);

        // Prepare action and attestationData
        const action = BigInt(0); // Adjust as needed

        // Prepare the attestation data to be sent
        const schemaId = 1; // Replace with actual schemaId
        const contractDetails = "content";
        const signerAddress = address;
        const indexingKey = "trend_post";
        const extraData = ethers.toUtf8Bytes("World ID Data");

        const abiCoder = new ethers.AbiCoder();

        const attestationData = abiCoder.encode(
          ["uint64", "string", "address", "string", "bytes"],
          [schemaId, contractDetails, signerAddress, indexingKey, extraData]
        ) as `0x${string}`;

        const { request } = await publicClient!.simulateContract({
          account: address,
          address: _currDispatcherAddr,
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

  return <Button label="Post from other chain" onClick={handleAttest}></Button>;
};

export default AttestationButton;
