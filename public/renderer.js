const { ipcRenderer } = require("electron");

// DOM elements
const configForm = document.getElementById("configForm");
const targetHostInput = document.getElementById("targetHost");
const targetPortInput = document.getElementById("targetPort");
const proxyPortInput = document.getElementById("proxyPort");
const saveBtn = document.getElementById("saveBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const serverStatus = document.getElementById("serverStatus");
const proxyUrl = document.getElementById("proxyUrl");
const targetUrl = document.getElementById("targetUrl");
const logsContainer = document.getElementById("logs");
const clearLogsBtn = document.getElementById("clearLogs");

// State
let isProxyRunning = false;
let currentConfig = null;

// Initialize the app
async function init() {
	await loadConfig();
	await updateStatus();
	setupEventListeners();
	addLog("Application initialized", "info");
}

// Load saved configuration
async function loadConfig() {
	try {
		const config = await ipcRenderer.invoke("get-proxy-config");
		if (config) {
			targetHostInput.value = config.targetHost || "localhost";
			targetPortInput.value = config.targetPort || 3000;
			proxyPortInput.value = config.proxyPort || 8080;
			currentConfig = config;
			updateUrls(config);
		}
	} catch (error) {
		addLog(`Failed to load configuration: ${error.message}`, "error");
	}
}

// Save configuration
async function saveConfig() {
	const config = {
		targetHost: targetHostInput.value.trim() || "localhost",
		targetPort: parseInt(targetPortInput.value) || 3000,
		proxyPort: parseInt(proxyPortInput.value) || 8080,
	};

	try {
		const result = await ipcRenderer.invoke("save-proxy-config", config);
		if (result.success) {
			currentConfig = config;
			updateUrls(config);
			addLog("Configuration saved successfully", "success");

			// Restart proxy if it's running
			if (isProxyRunning) {
				await startProxy();
			}
		}
	} catch (error) {
		addLog(`Failed to save configuration: ${error.message}`, "error");
	}
}

// Start proxy server
async function startProxy() {
	if (!currentConfig) {
		addLog("Please save configuration first", "warning");
		return;
	}

	try {
		startBtn.disabled = true;
		startBtn.textContent = "Starting...";

		const result = await ipcRenderer.invoke("start-proxy", currentConfig);

		if (result.success) {
			isProxyRunning = true;
			addLog(
				`Proxy server started on port ${currentConfig.proxyPort}`,
				"success"
			);
			addLog(
				`Routing to ${currentConfig.targetHost}:${currentConfig.targetPort}`,
				"info"
			);
		} else {
			addLog(`Failed to start proxy: ${result.error}`, "error");
		}
	} catch (error) {
		addLog(`Error starting proxy: ${error.message}`, "error");
	} finally {
		updateStatus();
		startBtn.disabled = false;
		startBtn.textContent = "Start Proxy";
	}
}

// Stop proxy server
async function stopProxy() {
	try {
		stopBtn.disabled = true;
		stopBtn.textContent = "Stopping...";

		const result = await ipcRenderer.invoke("stop-proxy");

		if (result.success) {
			isProxyRunning = false;
			addLog("Proxy server stopped", "success");
		} else {
			addLog(`Failed to stop proxy: ${result.error}`, "error");
		}
	} catch (error) {
		addLog(`Error stopping proxy: ${error.message}`, "error");
	} finally {
		updateStatus();
		stopBtn.disabled = false;
		stopBtn.textContent = "Stop Proxy";
	}
}

// Update status display
async function updateStatus() {
	try {
		const status = await ipcRenderer.invoke("get-proxy-status");
		isProxyRunning = status.isRunning;

		// Update server status
		const statusElement = serverStatus.parentElement;
		if (isProxyRunning) {
			serverStatus.textContent = "Running";
			statusElement.className = "status-item running";
			startBtn.disabled = true;
			stopBtn.disabled = false;
		} else {
			serverStatus.textContent = "Stopped";
			statusElement.className = "status-item stopped";
			startBtn.disabled = false;
			stopBtn.disabled = true;
		}

		// Update URLs if config exists
		if (status.config) {
			updateUrls(status.config);
		}
	} catch (error) {
		addLog(`Failed to update status: ${error.message}`, "error");
	}
}

// Update URL displays
function updateUrls(config) {
	if (config) {
		proxyUrl.textContent = `http://localhost:${config.proxyPort}`;
		targetUrl.textContent = `http://${config.targetHost}:${config.targetPort}`;
	} else {
		proxyUrl.textContent = "-";
		targetUrl.textContent = "-";
	}
}

// Add log entry
function addLog(message, type = "info") {
	const timestamp = new Date().toLocaleTimeString();
	const logEntry = document.createElement("div");
	logEntry.className = `log-entry ${type}`;
	logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span>${message}`;

	logsContainer.appendChild(logEntry);
	logsContainer.scrollTop = logsContainer.scrollHeight;

	// Keep only last 100 log entries
	while (logsContainer.children.length > 100) {
		logsContainer.removeChild(logsContainer.firstChild);
	}
}

// Clear logs
function clearLogs() {
	logsContainer.innerHTML = '<div class="log-entry">Logs cleared</div>';
}

// Validate form inputs
function validateForm() {
	const host = targetHostInput.value.trim();
	const targetPort = parseInt(targetPortInput.value);
	const proxyPort = parseInt(proxyPortInput.value);

	if (!host) {
		addLog("Target host is required", "error");
		return false;
	}

	if (!targetPort || targetPort < 1 || targetPort > 65535) {
		addLog("Target port must be between 1 and 65535", "error");
		return false;
	}

	if (!proxyPort || proxyPort < 1 || proxyPort > 65535) {
		addLog("Proxy port must be between 1 and 65535", "error");
		return false;
	}

	if (targetPort === proxyPort) {
		addLog("Target port and proxy port cannot be the same", "error");
		return false;
	}

	return true;
}

// Setup event listeners
function setupEventListeners() {
	// Form submission
	configForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (validateForm()) {
			await saveConfig();
		}
	});

	// Button clicks
	startBtn.addEventListener("click", startProxy);
	stopBtn.addEventListener("click", stopProxy);
	clearLogsBtn.addEventListener("click", clearLogs);

	// Input validation on change
	[targetPortInput, proxyPortInput].forEach((input) => {
		input.addEventListener("input", (e) => {
			const value = parseInt(e.target.value);
			if (value < 1 || value > 65535) {
				e.target.style.borderColor = "#f56565";
			} else {
				e.target.style.borderColor = "#e2e8f0";
			}
		});
	});

	// Auto-save on input change (debounced)
	let saveTimeout;
	[targetHostInput, targetPortInput, proxyPortInput].forEach((input) => {
		input.addEventListener("input", () => {
			clearTimeout(saveTimeout);
			saveTimeout = setTimeout(() => {
				if (validateForm()) {
					// Auto-save without restarting proxy
					const config = {
						targetHost: targetHostInput.value.trim() || "localhost",
						targetPort: parseInt(targetPortInput.value) || 3000,
						proxyPort: parseInt(proxyPortInput.value) || 8080,
					};
					currentConfig = config;
					updateUrls(config);
				}
			}, 1000);
		});
	});

	// Keyboard shortcuts
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey || e.metaKey) {
			switch (e.key) {
				case "s":
					e.preventDefault();
					if (validateForm()) {
						saveConfig();
					}
					break;
				case "r":
					e.preventDefault();
					if (isProxyRunning) {
						stopProxy().then(() => startProxy());
					} else {
						startProxy();
					}
					break;
			}
		}
	});
}

// Status update interval
setInterval(updateStatus, 5000);

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
