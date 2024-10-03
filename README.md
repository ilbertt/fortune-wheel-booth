# fortune-wheel-booth

Welcome to your new fortune-wheel-booth project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with fortune-wheel-booth, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd fortune-wheel-booth/
dfx help
dfx canister --help
```

## Requirements

- Node.js v20+
- pnpm v9 (https://pnpm.io)
- mops (https://mops.one)
- dfx (https://internetcomputer.org/docs/current/developer-docs/getting-started/install/)

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Install dependencies
pnpm install

# Starts the replica, running in the background
dfx start --background

# eventually pull the dependencies (only the first time)
dfx deps pull

# deploy all the canisters locally
./scripts/deploy-local-canisters.sh
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
dfx generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
pnpm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

## Usage

To get the last extraction (you don't need to be authenticated), use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getLastExtraction
```

### Admin

You are automatically set as an admin if you deploy the canister the first time.

The following methods are available for admins.

#### `extract`

To run an extraction as an admin, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend extract '(principal "<the-principal-you-want-to-extract-for>")'
```

#### `getExtraction`

To fetch the extraction for a principal, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getExtraction '(principal "<the-principal-you-want-to-fetch-the-extraction-for>")'
```

#### `getExtractions`

To fetch all extractions, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getExtractions
```

#### `getExtractionsCount`

To fetch the number of extractions, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getExtractionsCount
```

#### `clearExtractions`

To clear all the extractions made until now, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend clearExtractions
```

#### `manualTransfer`

To manually send tokens to a principal, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend manualTransfer '(
  record {
    tokens = variant { icp = 50_000_000 : nat }; # or ckBtc or ckEth or ckUsdc
    receiver = principal "<the-principal-you-want-to-send-to>";
  },
)'
```

You can use this method if you need to remove the tokens from the canister and send them back to your address.

#### `addAdmin`

To add an admin, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend addAdmin '(principal "<the-principal-you-want-to-add-as-admin>")'
```

#### `removeAdmin`

To remove an admin, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend removeAdmin '(principal "<the-principal-you-want-to-remove-as-admin>")'
```

#### `getAdmins`

To fetch the list of admins, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getAdmins
```

#### `getAvailablePrizes`

To fetch the available prizes, use the following command:

```bash
dfx canister call fortune-wheel-booth-backend getAvailablePrizes
```

> For ICP and ckBTC, the amount is specified in the format: 1 ICP = 10^8 token amount.
>
> For ckUSDC, the amount is specified in the format: 1 ckUSDC = 10^6 token amount.
>
> For ckETH, the amount is specified in the format: 1 ckETH = 10^18 token amount.

#### `setAvailablePrizes`

To set the available prizes, use the following command (values as example):

```bash
dfx canister call fortune-wheel-booth-backend setAvailablePrizes '(
  vec {
    record { variant { icp = 8_200_000 : nat }; opt (8 : nat8) };
    record { variant { ckBtc = 1_500 : nat }; opt (4 : nat8) };
    record { variant { merch = "Tshirt" }; ?5 };
    record { variant { merch = "Pen" }; ?10 };
    record { variant { special = "jackpot" }; ?1 };
    record { variant { noPrize }; null };
  },
)'
```

We suggest to first fetch the available prizes with the [`getAvailablePrizes`](#getavailableprizes) method and use that result to create the new available prizes array.

### Scripts

#### Fetch backend canister balances

To fetch the balances of the backend canister in the ledgers, use the following command:

```bash
# use --network local to fetch balances on local network (default if not specified)
./scripts/backend-canister-balances.sh --network ic
```

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
