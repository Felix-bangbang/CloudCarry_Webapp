#!/bin/bash
# View all CloudCarry early access signups

if [ -f "backend/submissions.csv" ]; then
    echo "=== CloudCarry Early Access Signups ==="
    echo ""
    cat backend/submissions.csv
else
    echo "No submissions yet."
fi
