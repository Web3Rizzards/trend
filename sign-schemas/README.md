# sign

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Scripts

This project uses Bun to run its scripts. The following scripts are available:

- Create schemas:

  ```bash
  bun run create
  ```

- Get schemas:

  ```bash
  bun run get
  ```

## Schema Types

The project defines three main schema types:

1. Person
2. Post
3. Reaction

You can find the detailed schema definitions in the `createSchemas.ts` file.

## Environment Setup

Make sure to set up your environment variables before running the scripts. You'll need to set:

- `PRIVATE_KEY`: Your private key for interacting with the Sign Protocol.

## File Structure

- `scripts/`: Contains the main scripts for creating and retrieving schemas.
- `libs/`: Includes constant definitions and type declarations.
- `schema_results.txt`: Output file containing the results of schema creation.
- `schema_responses.txt`: Output file containing the retrieved schema details.

## Dependencies

This project uses the following main dependencies:

- `@ethsign/sp-sdk`: Sign Protocol SDK
- `viem`: Ethereum interaction library

For a full list of dependencies, please refer to the `package.json` file.

## Note

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
