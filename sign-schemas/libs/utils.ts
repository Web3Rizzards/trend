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
export function getShortSchemaId(schemaId: string): string {
    // Extract the hex part from the end of the schemaId
    const hexPart = schemaId.split('_').pop();

    // Return the hex part if found, otherwise return the original schemaId
    return hexPart || schemaId;
}


// Helper function to get the long schema id
export function getLongSchemaId(chainId: string, schemaId: string): string {
    return `onchain_evm_${chainId}_${schemaId}`;
}