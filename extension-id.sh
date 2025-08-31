#!/bin/bash

# Usage: ./get-extension-id.sh path/to/extension.pem

PEM_FILE="$1"

if [[ -z "$PEM_FILE" || ! -f "$PEM_FILE" ]]; then
  echo "Usage: $0 path/to/extension.pem"
  exit 1
fi

# Step 1: Extract public key in DER (binary) format
openssl rsa -in "$PEM_FILE" -pubout -outform DER -out pubkey.der 2>/dev/null

if [[ ! -f pubkey.der ]]; then
  echo "Failed to generate public key from PEM."
  exit 1
fi

# Step 2: Compute SHA256 of the public key
HASH=$(openssl dgst -sha256 pubkey.der | awk '{print $2}')

# Step 3: Convert first 32 hex chars to Chrome's base16 alphabet (a–p)
CHROME_ID=""
for (( i=0; i<32; i++ )); do
  CHAR="${HASH:$i:1}"
  case "$CHAR" in
    0) CHROME_ID+="a" ;;
    1) CHROME_ID+="b" ;;
    2) CHROME_ID+="c" ;;
    3) CHROME_ID+="d" ;;
    4) CHROME_ID+="e" ;;
    5) CHROME_ID+="f" ;;
    6) CHROME_ID+="g" ;;
    7) CHROME_ID+="h" ;;
    8) CHROME_ID+="i" ;;
    9) CHROME_ID+="j" ;;
    a|A) CHROME_ID+="k" ;;
    b|B) CHROME_ID+="l" ;;
    c|C) CHROME_ID+="m" ;;
    d|D) CHROME_ID+="n" ;;
    e|E) CHROME_ID+="o" ;;
    f|F) CHROME_ID+="p" ;;
  esac
done

# Output the result
echo "$CHROME_ID"

# Clean up
rm -f pubkey.der
