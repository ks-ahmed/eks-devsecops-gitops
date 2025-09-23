# Mock DevSecOps metrics for dashboard

def get_trivy_status():
    return {
        "image": "vettlyai/frontend:latest",
        "vulnerabilities": 2,
        "critical": 0,
        "high": 1,
        "medium": 1,
        "low": 0,
        "last_scan": "2025-09-23T10:00:00Z"
    }

def get_tflint_status():
    return {
        "files_scanned": 5,
        "issues": 1,
        "warnings": 2,
        "last_scan": "2025-09-23T09:50:00Z"
    }

def get_checkov_status():
    return {
        "files_scanned": 5,
        "failed_checks": 0,
        "passed_checks": 12,
        "last_scan": "2025-09-23T09:45:00Z"
    }

def get_secrets_status():
    return {
        "github_secrets_configured": True,
        "kubernetes_secrets_configured": True
    }
