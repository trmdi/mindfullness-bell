#!/bin/bash

VERSION=$(jq -r '.version' src/manifest.json)

mkdir -p dist
npx crx pack ./src -o dist/extension.crx -p extension.pem


# calculate extension id
EXT_ID=""

# Step 1: Extract public key in DER (binary) format
openssl rsa -in extension.pem -pubout -outform DER -out pubkey.der 2>/dev/null

if [[ ! -f pubkey.der ]]; then
  echo "Failed to generate public key from PEM."
  exit 1
fi

# Step 2: Compute SHA256 of the public key
HASH=$(openssl dgst -sha256 pubkey.der | awk '{print $2}')

# Step 3: Convert first 32 hex chars to Chrome's base16 alphabet (a–p)
for (( i=0; i<32; i++ )); do
  CHAR="${HASH:$i:1}"
  case "$CHAR" in
    0) EXT_ID+="a" ;;
    1) EXT_ID+="b" ;;
    2) EXT_ID+="c" ;;
    3) EXT_ID+="d" ;;
    4) EXT_ID+="e" ;;
    5) EXT_ID+="f" ;;
    6) EXT_ID+="g" ;;
    7) EXT_ID+="h" ;;
    8) EXT_ID+="i" ;;
    9) EXT_ID+="j" ;;
    a|A) EXT_ID+="k" ;;
    b|B) EXT_ID+="l" ;;
    c|C) EXT_ID+="m" ;;
    d|D) EXT_ID+="n" ;;
    e|E) EXT_ID+="o" ;;
    f|F) EXT_ID+="p" ;;
  esac
done

# Clean up
rm -f pubkey.der

# generate update.xml file
CODEBASE="https://${REPO_OWNER}.github.io/${REPO_NAME}/dist/extension.crx"

cat > dist/update.xml <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<gupdate xmlns="http://www.google.com/update2/response" protocol="2.0">
  <app appid="${EXT_ID}">
    <updatecheck codebase="${CODE_BASE}" version="${VERSION}" />
  </app>
</gupdate>
EOF
