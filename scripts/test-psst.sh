#!/bin/sh
# Compiles the scoring module and runs the PSST rule against its boundary cases.
# The rule comes from a published paper; these cases are how we prove we kept it.
set -e
rm -rf .psst-build
npx tsc src/lib/psst.ts --outDir .psst-build --module commonjs --target es2020 --skipLibCheck
node tests/psst.test.cjs
rm -rf .psst-build
