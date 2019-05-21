#!/usr/bin/env bash
set -o errexit

SOURCE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=== removing frontend node modules ==="

rm -rf "${SOURCE_DIR}/frontend/node_modules" || true
rm "${SOURCE_DIR}/frontend/package-lock.json" || true

echo "Reset complete."