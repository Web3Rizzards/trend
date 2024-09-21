import { NextApiRequest, NextApiResponse } from "next";
import {
  ImageData,
  getNounData,
  getNounSeedFromBlockHash,
} from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { createHash } from "crypto";
import { keccak256 } from "viem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const address = req.query.address as `0x${string}`;
    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;
    const hash = keccak256(address);
    const seed = getNounSeedFromBlockHash(0, hash);
    const { parts, background } = getNounData(seed);
    const svgBinary = buildSVG(parts, palette, background);
    const response = { svg: btoa(svgBinary), background };
    res.status(200).send(svgBinary);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
}
