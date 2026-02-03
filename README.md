# CloudCarry Early Access System

A simple Rust backend for collecting early access signups from CloudCarry's GitHub Pages website.

## Project Structure

```
early-access-list/
├── backend/                # Rust backend server
│   ├── Cargo.toml         # Rust project configuration
│   ├── src/
│   │   └── main.rs        # Rust web server
│   ├── submissions.csv    # Stores all signups (auto-created)
│   └── target/            # Compiled binaries (auto-generated)
├── index.html             # Main landing page (GitHub Pages)
├── signup.html            # Early access signup form (GitHub Pages)
├── cloudcarry.png         # Logo
├── static/                # Static assets
└── README.md              # This file
```

## Setup

### Frontend (GitHub Pages)

The frontend files (`index.html`, `signup.html`, `cloudcarry.png`) are ready to deploy to GitHub Pages. No setup needed!

### Backend (Local Server)

1. **Start the Rust server:**
   ```bash
   cd backend
   cargo run
   ```
   The server will start on `http://localhost:3000`

2. **Stop the server:**
   Press `Ctrl+C` in the terminal

## How It Works

1. **Frontend (signup.html)**
   - Hosted on GitHub Pages
   - Collects name and TCD email from users
   - Validates email format client-side
   - Sends POST request to `http://localhost:3000/signup`

2. **Backend (Rust server)**
   - Runs locally on your computer
   - Listens on port 3000
   - Validates email ends with `@tcd.ie`
   - Validates name is at least 2 characters
   - Appends submission to `submissions.csv`
   - Returns success/error response

3. **Data Storage**
   - All submissions saved to `backend/submissions.csv`
   - Format: `timestamp,name,email`
   - Example: `2026-02-03 16:43:40 UTC,John Doe,john.doe@tcd.ie`

## Important Notes

**For local testing:**
- The signup form will only work when you're accessing it from the same machine running the backend server
- Make sure the Rust server is running before testing the form

**For public access:**
- Currently, the form only works when the backend server is running on localhost
- For public deployment, you would need to:
  1. Deploy the backend to a cloud service (e.g., Render, Railway, Fly.io, or your own VPS)
  2. Update the URL in `signup.html` from `http://localhost:3000/signup` to your deployed backend URL

## Validating Signups

View your collected signups:
```bash
cat backend/submissions.csv
```

Or open `backend/submissions.csv` in Excel/Google Sheets.

## Building for Production

Compile a release binary:
```bash
cd backend
cargo build --release
```

Run the optimized binary:
```bash
./backend/target/release/cloudcarry-server
```

## Customization

### Change the port
Edit `backend/src/main.rs`:
```rust
let addr = "127.0.0.1:3000";  // Change to your desired port
```

### Change output file
Edit `backend/src/main.rs`:
```rust
submissions_file: Arc::new(Mutex::new("submissions.csv".to_string())),
```

### Add more validation
Add checks in `validate_tcd_email` or `validate_name` functions in `backend/src/main.rs`.

## Dependencies

- axum: Web framework
- tokio: Async runtime
- serde: JSON serialization
- tower-http: CORS support
- chrono: Timestamps
