import { SignProtocolClient, SpMode, EvmChains, type Schema, IndexService, type Address } from '@ethsign/sp-sdk';
import type { PrivateKeyAccount, WalletClient } from 'viem';
import { PERSON_SCHEMA_ID, POST_SCHEMA_ID, REACTION_SCHEMA_ID } from './constants';
import type { PersonType, PostType, ReactionType } from './types';
import { parseAttestationData } from './utils';

export class TrendSDK {
    private client: SignProtocolClient;
    private indexService: IndexService;
    private walletClient: WalletClient | undefined;
    private account: PrivateKeyAccount | undefined;


    constructor(account?: PrivateKeyAccount, walletClient?: WalletClient) {

        // Use Wagmi Wallet Client, else use the account (private key)
        if (walletClient) {
            this.client = new SignProtocolClient(SpMode.OnChain, {
                chain: EvmChains.baseSepolia,
                walletClient: walletClient,
            });
            this.walletClient = walletClient;
        } else {
            if (!account) {
                throw new Error("Account is required");
            }

            this.client = new SignProtocolClient(SpMode.OnChain, {
                chain: EvmChains.baseSepolia,
                account: account,
            });
            this.account = account;
        }

        this.indexService = new IndexService("testnet");
    };

    getAttester(): Address {
        return this.account?.address as Address || this.walletClient?.account?.address as Address;
    }

    async createUserProfile(profile: PersonType): Promise<string> {
        const result = await this.client.createAttestation({
            schemaId: PERSON_SCHEMA_ID,
            data: profile,
            attester: this.getAttester(),
            indexingValue: `trend_profile_${profile.username}`,
        });
        return result.attestationId;
    }

    async getUserProfileByAddress(address: string, page: number = 1): Promise<PersonType | null> {
        const attestations = await this.indexService.queryAttestationList({
            schemaId: PERSON_SCHEMA_ID,
            attester: address,
            page,
        });

        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as PersonType;
            });

            // Return the first decoded attestation
            return decodedAttestations[0];
        }
        return null;
    }

    async getUserProfileByUsername(username: string, page: number = 1): Promise<PersonType | null> {

        const attestations = await this.indexService.queryAttestationList({
            schemaId: PERSON_SCHEMA_ID,
            indexingValue: `trend_profile_${username}`,
            page,

        });
        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as PersonType;
            });
            return decodedAttestations[0];
        }
        return null;
    }


    async writePost(post: PostType): Promise<string> {
        const result = await this.client.createAttestation({
            schemaId: POST_SCHEMA_ID,
            attester: this.getAttester(),
            data: post,
            indexingValue: `trend_post`,
        });
        return result.attestationId;
    }

    async getPosts(page: number = 1): Promise<PostType[] | null> {

        const attestations = await this.indexService.queryAttestationList({
            schemaId: POST_SCHEMA_ID,
            indexingValue: `trend_post`,
            page,

        });

        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as PostType;
            });
            return decodedAttestations;
        }
        return null;
    }

    async getPostsByUser(page: number = 1): Promise<PostType[] | null> {
        const attestations = await this.indexService.queryAttestationList({
            schemaId: POST_SCHEMA_ID,
            attester: this.getAttester(),
            indexingValue: `trend_post`,
            page,
        });

        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as PostType;
            });
            return decodedAttestations;
        }
        return null;
    }

    async reactToPost(postId: string, reaction: ReactionType): Promise<string> {
        const result = await this.client.createAttestation({
            schemaId: REACTION_SCHEMA_ID,
            linkedAttestationId: postId,
            attester: this.getAttester(),
            data: reaction,
            indexingValue: `trend_reaction_${postId}`,
        });
        return result.attestationId;
    }

    async getReactsForPost(postId: string): Promise<ReactionType[] | null> {
        const attestations = await this.indexService.queryAttestationList({
            id: postId,
            schemaId: REACTION_SCHEMA_ID,
            page: 1,
        });
        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as ReactionType;
            });
            return decodedAttestations;
        }
        return null;
    }

    async getReactsByUser(address: string, page: number = 1): Promise<ReactionType[] | null> {
        const attestations = await this.indexService.queryAttestationList({
            schemaId: REACTION_SCHEMA_ID,
            attester: address,
            page,
        });

        if (!attestations) {
            return null;
        }

        if (attestations.rows.length > 0) {
            const decodedAttestations = attestations.rows.map(attestation => {
                const decodedData = parseAttestationData(attestation);
                return decodedData as ReactionType;
            });
            return decodedAttestations;
        }
        return null;
    }
}
