from flask import Flask, jsonify
from flask_cors import CORS
from devsecops_data import get_trivy_status, get_tflint_status, get_checkov_status, get_secrets_status
import os
import psycopg2

app = Flask(__name__)
CORS(app)  # Enable CORS


# Database connection check
DB_HOST = os.getenv("POSTGRES_HOST", "database")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_USER = os.getenv("POSTGRES_USER", "vettly")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "vettlypass")
DB_NAME = os.getenv("POSTGRES_DB", "vettlydb")

def test_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME
        )
        conn.close()
        return True
    except Exception as e:
        print("DB connection failed:", e)
        return False

@app.route("/api/status")
def status():
    return jsonify({
        "backend_message": "Hello from VettlyAI DevSecOps Backend!",
        "database": "OK" if test_db_connection() else "FAIL",
        "trivy": get_trivy_status(),
        "tflint": get_tflint_status(),
        "checkov": get_checkov_status(),
        "secrets": get_secrets_status()
    })

@app.route("/")
def root():
    return jsonify(message="VettlyAI Backend running. Visit /api/status for DevSecOps metrics.")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
