# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies

Run the installation script:

```cmd
install.bat
```

Or manually:

```cmd
npm install
```

### 2. Start the Application

Use the launch script:

```cmd
start.bat
```

Or manually:

```cmd
npm start
```

### 3. Development Mode

For development with DevTools:

```cmd
npm run dev
```

## 🎯 Basic Usage

1. **Configure Target**: Set the destination host and port where you want to route traffic
2. **Set Proxy Port**: Choose the port where the proxy will listen for incoming requests
3. **Save & Apply**: Save your configuration
4. **Start Proxy**: Begin routing traffic

## 📋 Example Configuration

- **Target Host**: `localhost`
- **Target Port**: `3000` (your API server)
- **Proxy Port**: `8080` (the port clients will connect to)

**Result**: Requests to `http://localhost:8080/api/users` will be forwarded to `http://localhost:3000/api/users`

## 🔧 Features

- ✅ All HTTP methods supported (GET, POST, PUT, DELETE, etc.)
- ✅ Headers and request bodies preserved
- ✅ Real-time logging and status updates
- ✅ Persistent configuration storage
- ✅ Health check endpoint at `/health`
- ✅ CORS support for cross-origin requests

## 🚨 Troubleshooting

**Port already in use**: Change the proxy port to an unused port
**Cannot connect**: Verify the target server is running and accessible
**Permission denied**: Run as administrator if needed

## 🎛️ Keyboard Shortcuts

- **Ctrl+S**: Save configuration
- **Ctrl+R**: Restart proxy server

---

**Ready to route! 🌐**
