#!/bin/sh

set -e

export NODE_ENV="build"

CURRENT_DIR=`pwd`
PROJECT_DIR=`git rev-parse --show-toplevel`

cd $PROJECT_DIR

./scripts/clean.sh
./scripts/document.sh

mkdir build

./node_modules/.bin/concat-md --toc --decrease-title-levels --file-name-as-title --dir-name-as-title documentation/ > TEST.md

cp package.json build/package.json
cp README.md build/README.md

./node_modules/.bin/tsc --emitDeclarationOnly

./node_modules/.bin/babel src \
    --out-dir build \
    --extensions ".ts" \
    --source-maps inline \
    --ignore "src/**/test.ts" \
    --ignore "src/**/*.test.ts" \
    --verbose \
    "$@"

