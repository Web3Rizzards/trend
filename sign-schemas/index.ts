import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignSchema,
    type Schema,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';

const privateKey = process.env.PRIVATE_KEY as `0x${string}`; // THROWAWAY PK

if (!privateKey) {
    throw new Error('PRIVATE_KEY is not set or is not a valid 0xString');
}

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey), // optional
});

const delegationOptions = {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey), // optional
}

// Define the Person (Actor) Schema
const personSchema = {
    name: 'Person',
    description: 'Schema for decentralized social media user (Person)',
    items: [
        { name: 'id', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'displayName', type: 'string' },
        { name: 'inbox', type: 'string' },
        { name: 'outbox', type: 'string' },
        { name: 'followers', type: 'string' },
        { name: 'following', type: 'string' }
    ]
};

// Define the Post Activity Schema
const postActivitySchema: Schema = {
    name: 'PostActivity',
    description: 'Schema for user posting content',
    items: [
        { name: 'type', type: 'string', },
        { name: 'actor', type: 'string' },
        { name: 'object', type: 'string' },
        { name: 'published', type: 'string' }
    ]
};

// Define the Post Object Schema
const postSchema: Schema = {
    name: 'Post',
    description: 'Schema for content posts on social media',
    data: [
        { name: 'id', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'attributedTo', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'image', type: 'string' },
        { name: 'published', type: 'string' },
        { name: 'to', type: 'string[]' }
    ]
};

// Define the Reaction Schema (for likes and other reactions)
const reactionSchema: Schema = {
    name: 'Reaction',
    // description: 'Schema for reactions (like, love, etc.) on posts',
    data: [
        { name: 'type', type: 'string' },
        { name: 'actor', type: 'string' },
        { name: 'object', type: 'string' },
        { name: 'reactionType', type: 'string' },
        { name: 'attributedTo', type: 'string' },
        { name: 'issuedAt', type: 'string' }
    ],
};

// Register all the schemas
const registerSchemas = async () => {
    try {
        const personSchemaId = await client.createSchema(personSchema);
        const postActivitySchemaId = await client.createSchema(postActivitySchema);
        const postSchemaId = await client.createSchema(postSchema);
        const reactionSchemaId = await client.createSchema(reactionSchema);

        console.log('Schemas registered successfully:', {
            personSchemaId,
            postActivitySchemaId,
            postSchemaId,
            reactionSchemaId
        });
    } catch (error) {
        console.error('Error registering schemas:', error);
    }
};

// Call the function to register schemas
registerSchemas();