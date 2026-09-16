#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://127.0.0.1:8080}"
base_url="${base_url%/}"

old_paths=(
  "/docs/blockchain/arc-testnet/"
  "/docs/blockchain/arc-testnet"
  "/docs/blockchain/arc-testnet/arc-testnet-trades-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-trades-api"
  "/docs/blockchain/arc-testnet/arc-testnet-transfers-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-transfers-api"
  "/docs/blockchain/arc-testnet/arc-testnet-events-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-events-api"
  "/docs/blockchain/arc-testnet/arc-testnet-calls-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-calls-api"
  "/docs/blockchain/arc-testnet/arc-testnet-transactions-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-transactions-api"
  "/docs/blockchain/arc-testnet/arc-testnet-balances-api/"
  "/docs/blockchain/arc-testnet/arc-testnet-balances-api"
)

target_paths=(
  "/docs/blockchain/arc-mainnet/"
  "/docs/blockchain/arc-mainnet/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-events-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-events-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/"
  "/docs/blockchain/arc-mainnet/arc-mainnet-balances-api/"
)

failures=0

for index in "${!old_paths[@]}"; do
  old_path="${old_paths[$index]}"
  target_path="${target_paths[$index]}"
  headers="$(curl --path-as-is --silent --show-error --dump-header - --output /dev/null "${base_url}${old_path}")"
  status="$(printf '%s\n' "$headers" | awk 'NR == 1 {print $2}')"
  location="$(printf '%s\n' "$headers" | awk '/^[Ll]ocation:/ {sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit}')"

  if [[ "$status" != "301" ]]; then
    printf 'FAIL %s returned %s, expected 301\n' "$old_path" "${status:-no status}"
    failures=$((failures + 1))
  fi

  if [[ "$location" != "$target_path" && "$location" != "${base_url}${target_path}" ]]; then
    printf 'FAIL %s points to %s, expected %s\n' "$old_path" "${location:-no location}" "$target_path"
    failures=$((failures + 1))
  fi

  target_status="$(curl --path-as-is --silent --show-error --output /dev/null --write-out '%{http_code}' "${base_url}${target_path}")"
  if [[ "$target_status" != "200" ]]; then
    printf 'FAIL target %s returned %s, expected 200\n' "$target_path" "$target_status"
    failures=$((failures + 1))
  fi
done

query_headers="$(curl --path-as-is --silent --show-error --dump-header - --output /dev/null "${base_url}/docs/blockchain/arc-testnet/?utm_source=seo-test")"
query_location="$(printf '%s\n' "$query_headers" | awk '/^[Ll]ocation:/ {sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit}')"
if [[ "$query_location" != "/docs/blockchain/arc-mainnet/?utm_source=seo-test" && "$query_location" != "${base_url}/docs/blockchain/arc-mainnet/?utm_source=seo-test" ]]; then
  printf 'FAIL query string was not preserved: %s\n' "${query_location:-no location}"
  failures=$((failures + 1))
fi

if (( failures > 0 )); then
  printf 'Arc redirect checks failed: %d\n' "$failures"
  exit 1
fi

printf 'Arc redirect checks passed: 14 redirects, 7 targets, query string preserved\n'
