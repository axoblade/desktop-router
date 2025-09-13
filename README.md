# Desktop Router

A desktop HTTP traffic routing application built with Electron and Express. This application allows you to set up a proxy server that routes HTTP traffic from one endpoint to another with a user-friendly GUI.

## Features

- 🌐 **HTTP Traffic Routing**: Route all HTTP traffic from a proxy endpoint to a target server
- 🎛️ **User-friendly Interface**: Easy-to-use Electron-based GUI for configuration
- 💾 **Persistent Configuration**: Automatically saves and restores your routing settings
- 📊 **Real-time Status**: Live status updates and logging
- 🔄 **Method Preservation**: Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- 📦 **Header Forwarding**: Preserves all request headers and response data
- ❤️ **Health Monitoring**: Built-in health check endpoint
- 🌍 **CORS Support**: Cross-origin requests enabled

## How It Works

The application creates a proxy server that listens on a specified port and forwards all incoming requests to a target server. For example:

**Original Request:**

```
http://localhost:8080/api/users
```

**Gets routed to:**

```
http://targethost:3000/api/users
```

All request data, headers, and responses are preserved and forwarded exactly as received.

## Installation

1. **Clone the repository:**

   ```cmd
   git clone https://github.com/axoblade/desktop-router.git
   cd desktop-router
   ```

2. **Install dependencies:**

   ```cmd
   npm install
   ```

3. **Start the application:**
   ```cmd
   npm start
   ```

## Development

To run in development mode with DevTools:

```cmd
npm run dev
```

## Building

To build the application for distribution:

```cmd
npm run build
```

This will create platform-specific installers in the `dist` folder.

## Usage

1. **Launch the application**
2. **Configure your routing:**

   - **Target Host**: The destination host (e.g., `localhost`, `api.example.com`)
   - **Target Port**: The destination port (e.g., `3000`, `3200`)
   - **Proxy Port**: The port your proxy will listen on (e.g., `3200`)

3. **Save & Apply** your configuration
4. **Start Proxy** to begin routing traffic
5. **Monitor** the status and logs in real-time

## Configuration

The application automatically saves your configuration and restores it when you restart the app. Configuration includes:

- Target host and port
- Proxy listening port
- Server status (automatically starts with saved config)

## API Endpoints

When the proxy is running, it provides:

- **All routes**: `http://localhost:{proxyPort}/*` - Proxied to target server
- **Health check**: `http://localhost:{proxyPort}/health` - Returns proxy status

### Health Check Response

```json
{
	"status": "healthy",
	"proxy": {
		"target": "http://localhost:3000",
		"listening": 3200
	},
	"timestamp": "2025-09-13T10:40:00.000Z"
}
```

## Use Cases

- **API Development**: Route frontend requests to different backend servers
- **Testing**: Test applications against different environments
- **Load Balancing**: Simple traffic distribution (single target)
- **Development Proxy**: Route development traffic through a central point
- **Service Discovery**: Abstract service locations for local development

## Technical Details

### Architecture

- **Frontend**: Electron with HTML/CSS/JavaScript
- **Backend**: Express.js with http-proxy-middleware
- **Storage**: electron-store for persistent configuration
- **Proxy**: Full HTTP/HTTPS proxy with header preservation

### Dependencies

- **electron**: Desktop application framework
- **express**: Web server framework
- **http-proxy-middleware**: HTTP proxy functionality
- **electron-store**: Persistent configuration storage
- **cors**: Cross-origin request support
- **body-parser**: Request body parsing

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save configuration
- **Ctrl/Cmd + R**: Restart proxy (stop + start)

## Logs

The application provides real-time logging with:

- Timestamp for each entry
- Color coding for different log levels (info, success, error, warning)
- Automatic log rotation (keeps last 100 entries)
- Clear logs functionality

## Troubleshooting

### Common Issues

1. **Port already in use**

   - Change the proxy port to an unused port
   - Check if another application is using the port

2. **Cannot connect to target**

   - Verify the target host and port are correct
   - Ensure the target server is running
   - Check firewall settings

3. **Proxy not starting**
   - Check the logs for specific error messages
   - Ensure all configuration fields are valid
   - Try different port numbers

### Error Messages

The application provides detailed error messages in the logs section. Common error types:

- **Connection errors**: Target server unavailable
- **Port conflicts**: Port already in use
- **Configuration errors**: Invalid host/port combinations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and feature requests, please use the GitHub issues page.

---

**Built with ❤️ using Electron and Express**
