#!/bin/bash

set -e

IC_NETWORK="local"

# parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --network)
      IC_NETWORK="$2"
      shift # past argument
      shift # past value
      ;;
  esac
done

echo -e "\nFetching canister balances (network: $IC_NETWORK)..."

BACKEND_CANISTER_ID=$(dfx canister --network $IC_NETWORK id fortune-wheel-booth-backend)

echo -e "Backend canister id: $BACKEND_CANISTER_ID\n"

fetch_ledger_balance () {
  local LEDGER_CANISTER_ID=$1
  local TOKEN_SYMBOL=$2
  local DECIMALS=$3

  BACKEND_CANISTER_ACCOUNT="record { owner = principal \"$BACKEND_CANISTER_ID\"; subaccount = null; }"

  echo -e "$TOKEN_SYMBOL (ledger canister id: $LEDGER_CANISTER_ID):"
  BALANCE=$(dfx canister --network $IC_NETWORK call $LEDGER_CANISTER_ID icrc1_balance_of "$BACKEND_CANISTER_ACCOUNT")
  echo -e "$BALANCE ($DECIMALS decimals)\n"
}

echo -e "\nBalances:"

fetch_ledger_balance "ryjl3-tyaaa-aaaaa-aaaba-cai" "ICP" 8
fetch_ledger_balance "mxzaz-hqaaa-aaaar-qaada-cai" "ckBTC" 8
fetch_ledger_balance "ss2fx-dyaaa-aaaar-qacoq-cai" "ckETH" 18
fetch_ledger_balance "xevnm-gaaaa-aaaar-qafnq-cai" "ckUSDC" 6
