#!/bin/bash

echo "🚀 Preparing Sprout School for deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

echo "✅ Build complete! Your app is ready for deployment."
echo ""
echo "📁 Built files are in the 'dist' folder"
echo "🌐 Ready to deploy to sproutschool.co.in"
echo ""
echo "Next steps:"
echo "1. Push to GitHub if using Vercel/Netlify"
echo "2. Or upload 'dist' folder contents to your web hosting"
echo "3. Configure your domain DNS settings"
