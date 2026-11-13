#!/bin/bash
# Run from your machine: deploys the latest pushed `main` to the VPS.
# Requires the `deepRoots` host in ~/.ssh/config.
set -euo pipefail

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Warning: you have uncommitted changes. Only pushed commits are deployed."
fi

git fetch -q origin
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  echo "Warning: local HEAD differs from origin/main. Push first if you want your changes live."
fi

ssh deepRoots deploy-deeproots
