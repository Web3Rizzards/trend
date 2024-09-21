import ENVIRONMENT from "@/configuration/environment";
import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const proof = req.body;
  const app_id = ENVIRONMENT.WORLDCOIN_ID;
  const action = ENVIRONMENT.WORLDCOIN_ACTION_ID;
  const verifyRes = (await verifyCloudProof(
    proof,
    app_id as `app_${string}`,
    action
  )) as IVerifyResponse;

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    res.status(200).send(true);
  } else {
    // {
    //   success: false,
    //   code: 'max_verifications_reached',
    //   detail: 'This person has already verified for this action.',
    //   attribute: null
    // }
    if (verifyRes.code === "max_verifications_reached") {
      // Previously verified
      res.status(200).send(true);
    }

    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    res.status(400).send(false);
  }
}
