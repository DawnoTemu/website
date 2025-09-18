#!/bin/bash

# DawnoTemu GA4 Testing Startup Script
# Run this script to start comprehensive local testing

echo "🧪 DawnoTemu GA4 Testing Environment"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Please run this script from the website root directory"
    exit 1
fi

echo "📋 Pre-flight checks:"

# Check Node.js availability
if command -v node &> /dev/null; then
    echo "✅ Node.js available: $(node -v)"
    SERVER_TYPE="node"
elif command -v python3 &> /dev/null; then
    echo "✅ Python 3 available: $(python3 -V)"
    SERVER_TYPE="python"
else
    echo "❌ Neither Node.js nor Python 3 found. Please install one of them."
    exit 1
fi

# Check port 8080 availability
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Port 8080 is already in use"
    read -p "Kill existing server on port 8080? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:8080 | xargs kill -9
        echo "🔄 Killed existing server"
    else
        echo "❌ Cannot start server. Port 8080 is busy."
        exit 1
    fi
fi

echo "✅ Port 8080 is available"
echo ""

# Function to start server based on available runtime
start_server() {
    if [ "$SERVER_TYPE" = "node" ]; then
        echo "🚀 Starting Node.js server..."
        node local-testing-server.js &
    else
        echo "🚀 Starting Python server..."
        python3 -m http.server 8080 &
    fi
    SERVER_PID=$!
    echo "📍 Server PID: $SERVER_PID"
}

# Function to open browser
open_browser() {
    local url=$1
    if command -v open &> /dev/null; then
        # macOS
        open "$url"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$url"
    elif command -v start &> /dev/null; then
        # Windows
        start "$url"
    else
        echo "📋 Please manually open: $url"
    fi
}

# Start the server
start_server

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test server availability
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server is running successfully!"
    echo ""
    echo "🎯 Available Testing URLs:"
    echo "   🏠 Homepage: http://localhost:8080"
    echo "   🧪 Test Tool: http://localhost:8080/ga4-test-tool.html"
    echo "   📊 With UTMs: http://localhost:8080/?utm_source=facebook&utm_medium=cpc&utm_campaign=test&fbclid=test123"
    echo ""
    
    # Ask user what to open
    echo "What would you like to test?"
    echo "1) Open test tool (recommended)"
    echo "2) Open homepage"
    echo "3) Open homepage with Meta UTMs"
    echo "4) Run automated tests"
    echo "5) Manual testing only"
    echo ""
    read -p "Choose option (1-5): " -n 1 -r
    echo ""
    
    case $REPLY in
        1)
            echo "🧪 Opening GA4 test tool..."
            open_browser "http://localhost:8080/ga4-test-tool.html"
            ;;
        2)
            echo "🏠 Opening homepage..."
            open_browser "http://localhost:8080"
            ;;
        3)
            echo "🎯 Opening homepage with Meta UTMs..."
            open_browser "http://localhost:8080/?utm_source=facebook&utm_medium=cpc&utm_campaign=test&fbclid=test123"
            ;;
        4)
            echo "🤖 Running automated tests..."
            if [ "$SERVER_TYPE" = "node" ]; then
                sleep 2
                node test-ga4-functionality.js
            else
                echo "⚠️  Automated tests require Node.js"
                echo "   Install Node.js or run manual tests"
            fi
            ;;
        5)
            echo "📋 Manual testing mode - server ready"
            ;;
        *)
            echo "📋 Invalid option - server running for manual testing"
            ;;
    esac
    
    echo ""
    echo "📋 Testing Instructions:"
    echo "   1. Open browser console (F12) to see debug logs"
    echo "   2. Test consent flow and UTM detection"
    echo "   3. Check GA4 DebugView for real-time events"
    echo "   4. Use advanced debugger: copy advanced-ga4-debugger.js to console"
    echo ""
    echo "🛑 Press Ctrl+C to stop the server"
    
    # Keep script running and handle shutdown
    trap cleanup INT
    cleanup() {
        echo ""
        echo "🛑 Shutting down server..."
        kill $SERVER_PID 2>/dev/null
        echo "✅ Server stopped"
        exit 0
    }
    
    # Wait for user interrupt
    wait $SERVER_PID
    
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi