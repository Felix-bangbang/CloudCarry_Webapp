#!/bin/bash
# Start the CloudCarry backend server

# Kill any existing server on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

cd backend
cargo run
