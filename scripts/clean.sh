#!/usr/bin/env bash
# Removes build output from the repository

# Change the current working directory ($PWD) to the root of the
# repository to ensure this script always behaves consistently
cd $(git rev-parse --show-toplevel)

# Delete the dist folder
# Reference: https://git-scm.com/docs/git-clean
git clean ./dist -d -x --force --force
