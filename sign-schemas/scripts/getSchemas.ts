import { IndexService } from "@ethsign/sp-sdk";
import fs from 'fs';
import { PERSON_SCHEMA_WID_ID, POST_SCHEMA_WID_ID, REACTION_SCHEMA_WID_ID } from "../libs/constants";

async function main() {
    const indexService = new IndexService("testnet");
    const res = await indexService.querySchema(PERSON_SCHEMA_WID_ID);
    const res2 = await indexService.querySchema(POST_SCHEMA_WID_ID);
    const res3 = await indexService.querySchema(REACTION_SCHEMA_WID_ID);

    // Combine all responses into a single string
    const output = JSON.stringify({ person: res, post: res2, reaction: res3 }, null, 2);

    // Write the output to a file
    fs.writeFileSync('schema_responses.txt', output);
    console.log('Responses have been written to schema_responses.txt');
}

main().then(() => {
    console.log('Process completed successfully');
}).catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
