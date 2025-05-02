# Setup script for JT Studio React project
Write-Host "Setting up JT Studio React project..." -ForegroundColor Green

# Install required packages
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install styled-components @types/styled-components framer-motion

# Create fonts directory
Write-Host "Creating fonts directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "public/fonts"

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "IMPORTANT: You need to download Cal Sans font and place it in public/fonts directory." -ForegroundColor Red
Write-Host "See README.md for detailed instructions." -ForegroundColor Red
Write-Host "Run 'npm start' to start the development server." -ForegroundColor Green
