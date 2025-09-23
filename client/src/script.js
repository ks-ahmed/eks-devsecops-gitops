document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.cards');
  const backendUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api/status'
      : 'http://api.vettlyai.com/api/status';

  // Keep chart instances to update them dynamically
  let trivyChart, checkovChart;

  const renderDashboard = () => {
    const fetchUrl = `${backendUrl}?_=${new Date().getTime()}`; // cache-busting

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // --- Populate metric cards if first render ---
        if (!cardsContainer.innerHTML || cardsContainer.innerHTML.includes("Failed")) {
          cardsContainer.innerHTML = `
            <div class="card">
              <h2>Backend Status</h2>
              <p id="backend-message">${data.backend_message}</p>
              <p>Database: <span id="db-status" class="${data.database === 'OK' ? 'status-ok' : 'status-fail'}">${data.database}</span></p>
            </div>

            <div class="card">
              <h2>TFLint Status</h2>
              <p>Files Scanned: <span id="tflint-files">${data.tflint.files_scanned}</span></p>
              <p>Issues: <span id="tflint-issues" class="badge">${data.tflint.issues}</span>,
                 Warnings: <span id="tflint-warnings" class="badge">${data.tflint.warnings}</span></p>
            </div>

            <div class="card">
              <h2>Secrets Management</h2>
              <p>GitHub Secrets: <span id="github-secrets" class="${data.secrets.github_secrets_configured ? 'status-ok' : 'status-fail'}">${data.secrets.github_secrets_configured ? 'Configured' : 'Missing'}</span></p>
              <p>Kubernetes Secrets: <span id="k8s-secrets" class="${data.secrets.kubernetes_secrets_configured ? 'status-ok' : 'status-fail'}">${data.secrets.kubernetes_secrets_configured ? 'Configured' : 'Missing'}</span></p>
            </div>

            <div class="card">
              <h2>Trivy Vulnerabilities</h2>
              <div class="progress-bar"><div class="progress-fill" id="trivy-fill"></div></div>
            </div>

            <div class="card">
              <h2>Checkov Compliance</h2>
              <div class="progress-bar"><div class="progress-fill" id="checkov-fill"></div></div>
            </div>
          `;

          // Animate cards sequentially
          const cards = document.querySelectorAll('.card');
          cards.forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), index * 200);
          });

          // Initialize charts once
          const trivyChartCtx = document.getElementById('trivyChart').getContext('2d');
          trivyChart = new Chart(trivyChartCtx, {
            type: 'bar',
            data: {
              labels: ['Critical', 'High', 'Medium', 'Low'],
              datasets: [{
                label: 'Vulnerabilities',
                data: [data.trivy.critical, data.trivy.high, data.trivy.medium, data.trivy.low],
                backgroundColor: ['#ef4444', '#f97316', '#facc15', '#10b981']
              }]
            },
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
          });

          const checkovChartCtx = document.getElementById('checkovChart').getContext('2d');
          checkovChart = new Chart(checkovChartCtx, {
            type: 'doughnut',
            data: {
              labels: ['Passed', 'Failed'],
              datasets: [{
                data: [data.checkov.passed_checks, data.checkov.failed_checks],
                backgroundColor: ['#10b981', '#ef4444']
              }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
          });
        }

        // --- Update card metrics ---
        document.getElementById('backend-message').textContent = data.backend_message;
        const dbStatus = document.getElementById('db-status');
        dbStatus.textContent = data.database;
        dbStatus.className = data.database === 'OK' ? 'status-ok' : 'status-fail';

        document.getElementById('tflint-files').textContent = data.tflint.files_scanned;
        document.getElementById('tflint-issues').textContent = data.tflint.issues;
        document.getElementById('tflint-warnings').textContent = data.tflint.warnings;

        const githubSecrets = document.getElementById('github-secrets');
        githubSecrets.textContent = data.secrets.github_secrets_configured ? 'Configured' : 'Missing';
        githubSecrets.className = data.secrets.github_secrets_configured ? 'status-ok' : 'status-fail';

        const k8sSecrets = document.getElementById('k8s-secrets');
        k8sSecrets.textContent = data.secrets.kubernetes_secrets_configured ? 'Configured' : 'Missing';
        k8sSecrets.className = data.secrets.kubernetes_secrets_configured ? 'status-ok' : 'status-fail';

        // --- Update progress bars ---
        const totalVulns = data.trivy.critical + data.trivy.high + data.trivy.medium + data.trivy.low;
        const trivyFill = document.getElementById('trivy-fill');
        let trivyPercent = totalVulns > 0 ? Math.min(100, totalVulns * 10) : 5;
        trivyFill.style.width = trivyPercent + '%';
        trivyFill.style.backgroundColor = totalVulns === 0 ? '#10b981' : '#ef4444';

        const totalChecks = data.checkov.passed_checks + data.checkov.failed_checks;
        const checkovPercent = totalChecks > 0 ? Math.round((data.checkov.passed_checks / totalChecks) * 100) : 0;
        const checkovFill = document.getElementById('checkov-fill');
        checkovFill.style.width = checkovPercent + '%';
        checkovFill.style.backgroundColor = checkovPercent === 100 ? '#10b981' : '#f97316';

        // --- Update existing charts ---
        if (trivyChart) {
          trivyChart.data.datasets[0].data = [data.trivy.critical, data.trivy.high, data.trivy.medium, data.trivy.low];
          trivyChart.update();
        }

        if (checkovChart) {
          checkovChart.data.datasets[0].data = [data.checkov.passed_checks, data.checkov.failed_checks];
          checkovChart.update();
        }

      })
      .catch(err => {
        console.error('Failed to fetch DevSecOps data:', err);
        cardsContainer.innerHTML = `<p style="color:red;">Failed to load DevSecOps data. Retrying in 5s...</p>`;
        setTimeout(renderDashboard, 5000);
      });
  };

  // Initial render
  renderDashboard();

  // Live update every 30 seconds
  setInterval(renderDashboard, 30000);
});
