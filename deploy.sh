#!/bin/bash

# Navigate to application directory
cd $HOME/site/wwwroot

# Create and activate virtual environment if it doesn't exist
if [ ! -d "env" ]; then
    echo "Creating virtual environment..."
    python -m venv env
fi

# Install dependencies
echo "Installing dependencies..."
env/bin/pip install -r requirements.txt
env/bin/pip install gunicorn

# Make startup.txt executable
chmod +x startup.txt

echo "Deployment completed successfully."
