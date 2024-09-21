import { SignProtocolClient, SpMode, EvmChains, type Schema, IndexService } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import type { Account, LocalAccount, PrivateKeyAccount, WalletClient } from 'viem';
import { PERSON_SCHEMA_ID, POST_SCHEMA_ID, REACTION_SCHEMA_ID } from './constants';
import type { PersonType, PostType, ReactionType } from './types';
import { parseAttestationData } from './utils';

export class TrendSDK {
    private client: SignProtocolClient;
    private indexService: IndexService;

    constructor(account?: PrivateKeyAccount, walletClient?: WalletClient) {

        // Use Wagmi Wallet Client, else use the account (private key)
        if (walletClient) {
            this.client = new SignProtocolClient(SpMode.OnChain, {
                chain: EvmChains.baseSepolia,
                walletClient: walletClient,
            });
        } else {
            if (!account) {
                throw new Error("Account is required");
            }

            this.client = new SignProtocolClient(SpMode.OnChain, {
                chain: EvmChains.baseSepolia,
                account: account,
            });
        }

        this.indexService = new IndexService("testnet");

    };


    async createUserProfile(profile: PersonType): Promise<string> {
        const result = await this.client.createAttestation({
            schemaId: PERSON_SCHEMA_ID,
            data: profile,
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


}
