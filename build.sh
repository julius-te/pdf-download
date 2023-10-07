#!/bin/bash

if [ "$1" = "" ] || [ "$1" = "firefox" ]
then
    product="firefox"
    exclude="chrome"
elif [ "$1" = "chrome" ]
then
    product="chrome"
    exclude="firefox"
else
    echo "Usage: build.sh [firefox|chrome]"
    exit 1
fi

mkdir -p dist
rm -rf dist/$product

cp -r src dist/$product
rm dist/$product/*.ts
rm dist/$product/$exclude.json
mv dist/$product/$product.json dist/$product/manifest.json

./node_modules/.bin/tsc --outDir dist/$product
