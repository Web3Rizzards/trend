# trend

Social protocol for fitness apps on web3

## Sign Schemas

```
{
  "Person Schema": {
    "id": "onchain_evm_84532_0x2ea",
    "mode": "onchain",
    "chainType": "evm",
    "chainId": "84532",
    "schemaId": "0x2ea",
    "transactionHash": "0xde2dec793a8e8d79bfd2790c567437214a3934096abcfc5773fc0058d3978dde",
    "name": "Trend Person (WorldID)",
    "description": "Schema for Trend users",
    "revocable": true,
    "maxValidFor": "0",
    "resolver": "0x2e64c9d5007ab5e6ba6a65f04708d5ae949b8573",
    "registerTimestamp": "1726929408000",
    "registrant": "0xC3de06545BaB69447c57293a9eB789D4FFc95e21",
    "data": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "preferredUsername",
        "type": "string"
      }
    ]
  },
  "Post Schema": {
    "id": "onchain_evm_84532_0x2eb",
    "mode": "onchain",
    "chainType": "evm",
    "chainId": "84532",
    "schemaId": "0x2eb",
    "transactionHash": "0x29d768f3b4a5e7f9e32a465e297124aea7e1f308813d53ab64521a9923775cf9",
    "name": "Trend Post (WorldID)",
    "description": "Schema for Trend content posts",
    "revocable": true,
    "maxValidFor": "0",
    "resolver": "0x2e64c9d5007ab5e6ba6a65f04708d5ae949b8573",
    "registerTimestamp": "1726929414000",
    "registrant": "0xC3de06545BaB69447c57293a9eB789D4FFc95e21",
    "data": [
      {
        "name": "content",
        "type": "string"
      },
      {
        "name": "image",
        "type": "string"
      }
    ]
  },
  "Reaction Schema": {
    "id": "onchain_evm_84532_0x2ec",
    "mode": "onchain",
    "chainType": "evm",
    "chainId": "84532",
    "schemaId": "0x2ec",
    "transactionHash": "0x92d83b8bbccd42b514e2024e61f6f23d33f92ce97ef8c54edb19e870ad429b40",
    "name": "Trend Reaction (WorldID)",
    "description": "Schema for reactions (like, love, etc.) on posts on Trend",
    "revocable": true,
    "maxValidFor": "0",
    "resolver": "0x2e64c9d5007ab5e6ba6a65f04708d5ae949b8573",
    "registerTimestamp": "1726929418000",
    "registrant": "0xC3de06545BaB69447c57293a9eB789D4FFc95e21",
    "data": [
      {
        "name": "reactionType",
        "type": "string"
      }
    ]
  }
}
```
