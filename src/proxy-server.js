const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");

let proxyServer = null;
let currentConfig = null;

/**
 * Start the proxy server with the given configuration
 * @param {Object} config - Configuration object
 * @param {string} config.targetHost - Target host to proxy to
 * @param {number} config.targetPort - Target port to proxy to
 * @param {number} config.proxyPort - Port to run the proxy server on
 */
function startProxyServer(config) {
	try {
		// Stop existing server if running
		if (proxyServer) {
			stopProxyServer();
		}

		const app = express();
		currentConfig = config;

		// Enable CORS for all routes
		app.use(cors());

		// Parse JSON and URL-encoded bodies
		app.use(bodyParser.json({ limit: "50mb" }));
		app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

		// Health check endpoint
		app.get("/health", (req, res) => {
			res.json({
				status: "healthy",
				proxy: {
					target: `http://${config.targetHost}:${config.targetPort}`,
					listening: config.proxyPort,
				},
				timestamp: new Date().toISOString(),
			});
		});

		// Proxy configuration
		const proxyOptions = {
			target: `http://${config.targetHost}:${config.targetPort}`,
			changeOrigin: true,
			logLevel: "info",
			onProxyReq: (proxyReq, req, res) => {
				// Log incoming requests
				console.log(
					`[PROXY] ${req.method} ${req.url} -> http://${config.targetHost}:${config.targetPort}${req.url}`
				);

				// Preserve original headers
				if (
					req.body &&
					(req.method === "POST" ||
						req.method === "PUT" ||
						req.method === "PATCH")
				) {
					const bodyData = JSON.stringify(req.body);
					proxyReq.setHeader("Content-Type", "application/json");
					proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
					proxyReq.write(bodyData);
				}
			},
			onProxyRes: (proxyRes, req, res) => {
				// Log responses
				console.log(
					`[PROXY] ${proxyRes.statusCode} <- http://${config.targetHost}:${config.targetPort}${req.url}`
				);
			},
			onError: (err, req, res) => {
				console.error(`[PROXY ERROR] ${err.message}`);
				res.status(500).json({
					error: "Proxy Error",
					message: err.message,
					target: `http://${config.targetHost}:${config.targetPort}`,
					timestamp: new Date().toISOString(),
				});
			},
		};

		// Create proxy middleware for all routes except health check
		const proxy = createProxyMiddleware("/**", proxyOptions);

		// Apply proxy to all routes except health check
		app.use((req, res, next) => {
			if (req.path === "/health") {
				return next();
			}
			return proxy(req, res, next);
		});

		// Start the server
		proxyServer = app.listen(config.proxyPort, () => {
			console.log(`Proxy server running on port ${config.proxyPort}`);
			console.log(
				`Routing traffic to http://${config.targetHost}:${config.targetPort}`
			);
		});

		return {
			success: true,
			message: `Proxy server started on port ${config.proxyPort}`,
			config: config,
		};
	} catch (error) {
		console.error("Failed to start proxy server:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * Stop the proxy server
 */
function stopProxyServer() {
	if (proxyServer) {
		proxyServer.close();
		proxyServer = null;
		currentConfig = null;
		console.log("Proxy server stopped");
		return { success: true, message: "Proxy server stopped" };
	}
	return { success: true, message: "Proxy server was not running" };
}

/**
 * Update proxy configuration and restart server
 * @param {Object} config - New configuration
 */
function updateProxyConfig(config) {
	if (proxyServer) {
		stopProxyServer();
		return startProxyServer(config);
	}
	return {
		success: true,
		message: "Configuration updated (server not running)",
	};
}

/**
 * Get current proxy server status
 */
function getProxyStatus() {
	return {
		isRunning: proxyServer !== null,
		config: currentConfig,
	};
}

module.exports = {
	startProxyServer,
	stopProxyServer,
	updateProxyConfig,
	getProxyStatus,
};
