#!/bin/bash
# Android Studio environment setup script

# Set Node.js path
export PATH="/Users/henry/.nvm/versions/node/v22.20.0/bin:$PATH"
export NODE_PATH="/Users/henry/.nvm/versions/node/v22.20.0/bin/node"

# Launch Android Studio with proper environment
open -a "Android Studio" "$@"