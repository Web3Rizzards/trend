import type { AttestationInfo } from "@ethsign/sp-sdk/dist/types/indexService";
import { decodeAbiParameters } from 'viem';

export function parseAttestationData(attestation: AttestationInfo): any {
    const data = decodeAbiParameters(
        attestation.dataLocation === "onchain" ? attestation.schema.data : [{ type: "string" }],
        attestation.data as `0x${string}`
    );
    const parsedData: any = {};
    data.forEach((item: any, i: number) => {
        parsedData[attestation.schema.data[i].name] = item;
    });
    return parsedData;
}