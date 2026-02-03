use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::post,
    Router,
};
use chrono::Utc;
use serde::Deserialize;
use std::sync::Arc;
use std::fs::OpenOptions;
use std::io::Write;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState {
    submissions_file: Arc<Mutex<String>>,
}

#[derive(Debug, Deserialize)]
struct SignupRequest {
    name: String,
    email: String,
}

fn validate_tcd_email(email: &str) -> bool {
    let email_lower = email.to_lowercase();
    email_lower.ends_with("@tcd.ie") && email_lower.len() > 8
}

fn validate_name(name: &str) -> bool {
    let trimmed = name.trim();
    !trimmed.is_empty() && trimmed.len() >= 2
}

async fn save_to_csv(name: &str, email: &str, file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let timestamp = Utc::now().format("%Y-%m-%d %H:%M:%S UTC").to_string();
    
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(file_path)?;
    
    writeln!(file, "{},{},{}", timestamp, name, email)?;
    Ok(())
}

async fn signup_handler(
    State(state): State<AppState>,
    Json(payload): Json<SignupRequest>,
) -> (StatusCode, Json<serde_json::Value>) {
    if !validate_name(&payload.name) {
        return (
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({
                "error": "Name must be at least 2 characters long"
            })),
        );
    }

    if !validate_tcd_email(&payload.email) {
        return (
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({
                "error": "Must be a valid TCD email address (@tcd.ie)"
            })),
        );
    }

    let file_path = state.submissions_file.lock().await;

    if let Err(e) = save_to_csv(&payload.name, &payload.email, &file_path).await {
        tracing::error!("Failed to save submission: {}", e);
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({
                "error": "Failed to save submission"
            })),
        );
    }

    tracing::info!("New signup: {} - {}", payload.name, payload.email);

    (
        StatusCode::OK,
        Json(serde_json::json!({
            "message": "Successfully joined the waitlist!"
        })),
    )
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let state = AppState {
        submissions_file: Arc::new(Mutex::new("submissions.csv".to_string())),
    };

    let app = Router::new()
        .route("/signup", post(signup_handler))
        .with_state(state)
        .layer(
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods([axum::http::Method::POST])
                .allow_headers([axum::http::header::CONTENT_TYPE]),
        );

    let addr = "127.0.0.1:3000";
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
