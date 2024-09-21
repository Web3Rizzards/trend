import { IndexService } from "@ethsign/sp-sdk";
import { parseAttestationData } from "../libs/utils";

async function main() {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestation("onchain_evm_11155111_0x312");

    if (!res) {
        console.error('res is null');
        return;
    }

    const parsedData = parseAttestationData(res);
    console.log(parsedData)

}

main().then(() => {
    console.log('Process completed successfully');
}).catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
