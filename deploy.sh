#!/bin/bash

# Navigate to application directory
cd $HOME/site/wwwroot

# Create and activate virtual environment if it doesn't exist
if [ ! -d "env" ]; then
    echo "Creating virtual environment..."
    # Use the full path to Python in Azure App Service
    /usr/bin/python3 -m venv env
fi

# Install dependencies
echo "Installing dependencies..."
./env/bin/pip install -r requirements.txt
./env/bin/pip install gunicorn

# Make sure the directory exists before trying to make files executable
if [ -f "startup.txt" ]; then
    echo "Making startup script executable..."
    chmod +x startup.txt
fi

echo "Deployment completed successfully."