#!/bin/bash
# n8n Setup Script for Blog Summarizer Project

echo "🔧 Setting up n8n for Blog Summarizer..."

# Install n8n globally
npm install -g n8n

# Create n8n data directory
mkdir -p ~/.n8n

# Create workflows directory
mkdir -p ./n8n-workflows/test-requests

echo "✅ n8n installed successfully!"
echo "🚀 Run 'npm run start-n8n' to start the server"

