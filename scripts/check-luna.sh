#!/bin/sh
# The name is Oriyali. Never Luna.
# Scoped to what ships: source and static assets. Any hit is a bug.
if grep -rniE '\bluna\b' src public 2>/dev/null; then
  echo "x Found 'Luna' in shipped source. The name is Oriyali."
  exit 1
fi
echo "ok - no 'Luna' in src or public."
