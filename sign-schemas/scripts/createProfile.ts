import { TrendSDK } from "../libs";
import { privateKeyToAccount } from "viem/accounts";
import { getLongSchemaId } from "../libs/utils";

async function main() {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    const sdk = new TrendSDK(account);
    // Create user profile
    const profile = await sdk.createUserProfile({
        name: "john_doe",
        preferredUsername: "John Doe",
    });
    console.log(`Profile created, (attestation id: ${profile})`);

    // Get user profile by address
    const profileByAddress = await sdk.getUserProfileByAddress(account.address);
    console.log(`Profile fetched by address:`, profileByAddress);

    // Get user profile by username
    const profileByUsername = await sdk.getUserProfileByUsername("John Doe");
    console.log(`Profile fetched by username:`, profileByUsername);

    // Write a post
    const post = await sdk.writePost({
        content: "Hello, this is my first post!",
        image: "https://example.com/image.jpg",
    });

    // const post = "0x82e"
    console.log(`Post created, (attestation id: ${post})`);

    // Get all posts
    const allPosts = await sdk.getPosts();
    console.log(`All posts:`, allPosts);

    // Get posts by user
    const userPosts = await sdk.getPostsByUser();
    console.log(`User posts:`, userPosts);

    // React to a post
    const reaction = await sdk.reactToPost(post, {
        reactionType: "like",
    });
    console.log(`Reaction created, (attestation id: ${reaction})`);

    // Get reactions for a post
    const postReactions = await sdk.getReactsForPost(post);
    console.log(`Reactions for post ${post}:`, postReactions);

    // Get reactions by user
    const userReactions = await sdk.getReactsByUser(account.address);
    console.log(`User reactions:`, userReactions);
}

main().then(() => {
    console.log('Schemas registered successfully');
}).catch((error) => {
    console.error('Error registering schemas:', error);
    process.exit(1);
});