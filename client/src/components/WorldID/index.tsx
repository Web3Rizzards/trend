"use client";

import ENVIRONMENT from "@/configuration/environment";
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from "@worldcoin/idkit";
import Button from "../Shared/Button";
import { useAccount } from "wagmi";
import userDb from "@/lib/database/User";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";

const VERIFICATION_ACTION = ENVIRONMENT.WORLDCOIN_ACTION_ID;

const WorldId = () => {
  const { verified, setData } = useUser();
  const { address } = useAccount();

  const handleVerify = async (
    proof: ISuccessResult,
    address: `0x${string}`
  ) => {
    // Sample proof
    //   {
    //     "proof": "0x00fd8e4629017fef831c14aa134d9cf9fb1614cd18b24152f30c2e63b9550532051ee84c6d9c2395a88c32b7ca40824df1d92c96f9c3bbc43ed5e88855ef47780d77987f0d3aa536c97949b2ad25390ed89073d842b0b1b049ce198f604c94802dc2eb92b7966a81454c6f1420fb101bbf185fc5f30cb2162e95f8090a3ad1b9229c31d4c89b447e95a82a7b7bcc7209ecac924c018fd7f7429777401fa12fe81089b2c8d259b8aeac3f9b3d7954b373ec1010ad5690debf933311c43e8ffd2e2153a499dea6542e3c7f04d16f73caa9aaeca97be2883130e9d71b7503fd77e11582a98893aae1fc69d87401131f9565bc2313de874790d69ae64a4284d8f831",
    //     "merkle_root": "0x2897864a946c0d6c516626273dfaac3213470b8abfba95ad255c8c0d6dbe7cb5",
    //     "nullifier_hash": "0x0784518dbb2fed7650a9b7a3473bdccc4826e0b05158190ed0085378248e9312",
    //     "verification_level": "device"
    // }

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proof),
    });
    if (res.ok) {
      const response = await userDb.createUser(
        address,
        proof.proof,
        proof.merkle_root,
        proof.nullifier_hash
      );
      if (response) {
        setData(proof.proof, proof.merkle_root, proof.nullifier_hash);
        toast.success("Verified");
      }
    } else {
      throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }
  };

  const onSuccess = () => {
    console.log("Success");
  };

  if (verified) return <Button label="Verified" />;
  return (
    <IDKitWidget
      app_id={ENVIRONMENT.WORLDCOIN_ID as `app_${string}`}
      action={VERIFICATION_ACTION}
      verification_level={VerificationLevel.Device}
      handleVerify={(proof) => handleVerify(proof, address!)}
      onSuccess={onSuccess}
    >
      {({ open }) => (
        <Button label="Verify with World ID" onClick={open}></Button>
      )}
    </IDKitWidget>
  );
};

export default WorldId;
