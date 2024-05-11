#!/bin/bash

set -e

echo -e "\nDeploying dependencies...\n"
dfx deps deploy

CURRENT_IDENTITY=$(dfx identity whoami)
MINTER_IDENTITY=minter

if dfx identity use $MINTER_IDENTITY ; then
  # go back to the original identity
  dfx identity use $CURRENT_IDENTITY
else
  dfx identity new $MINTER_IDENTITY
fi

MINTER_PRINCIPAL=$(dfx identity --identity $MINTER_IDENTITY get-principal)
echo -e "\nMinter identity principal: $MINTER_PRINCIPAL\n"

CURRENT_PRINCIPAL=$(dfx identity --identity $CURRENT_IDENTITY get-principal)
echo -e "\nCurrent identity principal: $CURRENT_PRINCIPAL\n"

deploy_ledger () {
  local LEDGER_CANISTER_ID=$1
  local LEDGER_CANISTER_NAME=$2
  local TOKEN_SYMBOL=$3
  local TOKEN_NAME=$4
  local DECIMALS=$5
  local PRE_MINTED_TOKENS=$6

  local TRANSFER_FEE=10_000

  echo -e "\nDeploying $LEDGER_CANISTER_NAME canister: Parameters:"
  echo "  LEDGER_CANISTER_ID: $LEDGER_CANISTER_ID"
  echo "  LEDGER_CANISTER_NAME: $LEDGER_CANISTER_NAME"
  echo "  TOKEN_SYMBOL: $TOKEN_SYMBOL"
  echo "  TOKEN_NAME: $TOKEN_NAME"
  echo "  DECIMALS: $DECIMALS"
  echo -e "  TRANSFER_FEE: $TRANSFER_FEE\n"

  CURRENT_ACCOUNT="record { owner = principal \"$CURRENT_PRINCIPAL\"; subaccount = null; }"

  dfx deploy --specified-id $LEDGER_CANISTER_ID $LEDGER_CANISTER_NAME --argument "
    (variant {
      Init = record {
        minting_account = record {
          owner = principal \"$MINTER_PRINCIPAL\";
          subaccount = null;
        };
        fee_collector_account = null;
        transfer_fee = $TRANSFER_FEE;
        decimals = opt $DECIMALS;
        max_memo_length = null;
        token_symbol = \"$TOKEN_SYMBOL\";
        token_name = \"$TOKEN_NAME\";
        metadata = vec {};
        initial_balances = vec {
          record {
            $CURRENT_ACCOUNT;
            $PRE_MINTED_TOKENS;
          };
        };
        feature_flags = null;
        maximum_number_of_accounts = null;
        accounts_overflow_trim_quantity = null;
        archive_options = record {
          num_blocks_to_archive = 0;
          max_transactions_per_response = null;
          trigger_threshold = 0;
          max_message_size_bytes = null;
          cycles_for_archive_creation = null;
          node_max_memory_size_bytes = null;
          controller_id = principal \"$CURRENT_PRINCIPAL\";
          more_controller_ids = null;
        };
      }
    })
  "

  echo -e "\nBalance of $CURRENT_PRINCIPAL on $LEDGER_CANISTER_NAME:"
  dfx canister call $LEDGER_CANISTER_NAME icrc1_balance_of "$CURRENT_ACCOUNT"
}

# ICP (1000 initial balance)
deploy_ledger "ryjl3-tyaaa-aaaaa-aaaba-cai" "icp_ledger" "LICP" "Local ICP" 8 100_000_000_000
#ckBTC (1000 initial balance)
deploy_ledger "mxzaz-hqaaa-aaaar-qaada-cai" "ckbtc_ledger" "LckBTC" "Local ckBTC" 8 100_000_000_000
#ckETH (1 initial balance)
deploy_ledger "ss2fx-dyaaa-aaaar-qacoq-cai" "cketh_ledger" "LckETH" "Local ckETH" 18 1_000_000_000_000_000_000

echo -e "\n Deployed all ledger canisters\n"

FRONTEND_CANISTER_NAME=fortune-wheel-booth-frontend
BACKEND_CANISTER_NAME=fortune-wheel-booth-backend

echo -e "\nDeploying backend canister...\n"
dfx deploy $BACKEND_CANISTER_NAME

BACKEND_PRINCIPAL=$(dfx canister id $BACKEND_CANISTER_NAME)
echo -e "\nBackend canister principal: $BACKEND_PRINCIPAL\n"

top_up_backend_canister () {
  local LEDGER_CANISTER_NAME=$1
  local AMOUNT=$2

  local BACKEND_ACCOUNT="record { owner = principal \"$BACKEND_PRINCIPAL\"; subaccount = null; }"

  dfx canister call $LEDGER_CANISTER_NAME icrc1_transfer "
    (record {
      from_subaccount = null;
      to = $BACKEND_ACCOUNT;
      amount = $AMOUNT;
      fee = null;
      memo = null;
      created_at_time = null;
    })"

  echo -e "\nBalance of backend canister on $LEDGER_CANISTER_NAME:"
  dfx canister call $LEDGER_CANISTER_NAME icrc1_balance_of "$BACKEND_ACCOUNT"
}

echo -e "\nTopping up backend canister...\n"
# transfer 500 ICP to backend
top_up_backend_canister icp_ledger 50_000_000_000
# transfer 500 ckBTC to backend
top_up_backend_canister ckbtc_ledger 50_000_000_000
# transfer 0.5 ckETH to backend
top_up_backend_canister cketh_ledger 500_000_000_000_000_000

echo -e "\nDeploying frontend canister...\n"
dfx deploy $FRONTEND_CANISTER_NAME

echo -e "\n Deployed all canisters\n"