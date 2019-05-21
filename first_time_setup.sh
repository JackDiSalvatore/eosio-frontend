#!/usr/bin/env bash
set -o errexit


SOURCE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=== start of first time setup ==="

# set up node_modules for frontend
echo "=== npm install package for frontend react app ==="
# change directory to ./frontend
cd "./frontend"
npm install

echo "First time setup is complete."
