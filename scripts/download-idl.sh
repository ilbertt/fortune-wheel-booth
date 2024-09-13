#!/bin/bash

download_candid() {
    local canister_name="$1"

    # Check if dfx.json exists
    if [ ! -f "dfx.json" ]; then
        echo "Error: dfx.json not found"
        return 1
    fi

    # Extract the URL and the name using jq
    local url=$(jq -r ".canisters.\"$canister_name\".candid" dfx.json)
    local name=$(jq -r ".canisters.\"$canister_name\".remote.id.ic" dfx.json)

    # Check if the URL and name are not null
    if [ "$url" == "null" ] || [ "$name" == "null" ]; then
        echo "Error: Unable to extract URL or name from dfx.json for canister $canister_name"
        return 1
    fi

    # Download the file from the URL
    local output_file=".dfx/ic/canisters/idl/$name.did"
    curl -o "$output_file" "$url"

    # Check if the download was successful
    if [ $? -ne 0 ]; then
        echo "Error: Failed to download $url"
        return 1
    fi

    echo "Downloaded $url to $output_file"
    return 0
}

mkdir -p .dfx/ic/canisters/idl
# Call the function with the arguments arg1, arg2, and arg3
for arg in  "icp_ledger" "ckbtc_ledger" "cketh_ledger" "ckusdc_ledger"; do
    download_candid "$arg"
done