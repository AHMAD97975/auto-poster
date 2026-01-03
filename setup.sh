#!/bin/bash

# Auto Poster Hub - Environment Setup Script
# This script helps set up the development environment

echo "🚀 Auto Poster Hub - Environment Setup"
echo "======================================"
echo ""

# Check if we're in the correct project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "   Please run this script from the root directory of the Auto Poster Hub project."
    exit 1
fi

# Verify this is the correct project
if ! grep -q "auto-poster-hub" package.json; then
    echo "⚠️  Warning: This doesn't appear to be the Auto Poster Hub project."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Setup environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your Gemini API key!"
    echo "   1. Get your API key from: https://aistudio.google.com/apikey"
    echo "   2. Open .env.local and replace 'your_gemini_api_key_here' with your actual key"
    echo ""
else
    echo "ℹ️  .env.local file already exists"
    echo ""
fi

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Make sure to add your Gemini API key to .env.local"
echo "  2. Run 'npm run dev' to start the development server"
echo ""
