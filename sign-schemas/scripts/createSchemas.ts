import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignSchema,
    type Schema,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';

const privateKey = process.env.PRIVATE_KEY as `0x${string}`; // THROWAWAY PK

if (!privateKey) {
    throw new Error('PRIVATE_KEY is not set or is not a valid 0xString');
}

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey), // optional
});


// Define the Person (Actor) Schema
const personSchema: Schema = {
    name: 'Trend Person',
    description: 'Schema for Trend users',
    data: [
        { name: 'name', type: 'string' },
        { name: 'preferredUsername', type: 'string' },
    ]
};


// Define the Post Object Schema
const postSchema: Schema = {
    name: 'Trend Post',
    description: 'Schema for Trend content posts',
    data: [
        { name: 'content', type: 'string' },
        { name: 'image', type: 'string' },
    ]
};

// Define the Reaction Schema (for likes and other reactions)
const reactionSchema: Schema = {
    name: 'Trend Reaction',
    description: 'Schema for reactions (like, love, etc.) on posts on Trend',
    data: [
        { name: 'reactionType', type: 'string' },
    ],
};

// Modify the registerSchemas function
const registerSchemas = async () => {
    const results = [];
    try {
        const schemas = [
            { name: 'Person', schema: personSchema },
            { name: 'Post', schema: postSchema },
            { name: 'Reaction', schema: reactionSchema }
        ];

        for (const { name, schema } of schemas) {
            console.log(`Creating schema: ${name}...`);
            const result = await client.createSchema(schema);
            console.log(`Schema ${name} created. SchemaID: ${result.schemaId}, TxHash: ${result.txHash}`);
            results.push({ name, schemaId: result.schemaId, txHash: result.txHash });
        }

        console.log('All schemas registered successfully');
        return results;
    } catch (error) {
        console.error('Error registering schemas:', error);
        throw error;
    }
};

async function main() {
    const results = await registerSchemas();

    // Write results to a file
    const output = results.map(r => `${r.name}: SchemaID: ${r.schemaId}, TxHash: ${r.txHash}`).join('\n');
    fs.writeFileSync('schema_results.txt', output);

    console.log('Results written to schema_results.txt');
}

main().then(() => {
    console.log('Schemas registered successfully');
}).catch((error) => {
    console.error('Error registering schemas:', error);
    process.exit(1);
});