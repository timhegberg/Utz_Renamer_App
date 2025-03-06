# Utz Retailer Image Renaming Tool

A comprehensive web application for efficient batch image file management with advanced processing capabilities.

## Features
- Python 3.11 backend with Flask web framework
- Responsive UI with dynamic theme switching
- Advanced file upload system with drag-and-drop functionality
- Comprehensive file processing with real-time progress tracking
- Intuitive image renaming interface

## Azure Deployment Instructions

This application is configured for deployment to Azure App Service. Follow these steps:

1. **Create Azure Resources**
   - Create a Resource Group
   - Create an App Service Plan
   - Create a Web App with Python 3.11 runtime

2. **Configure Deployment**
   - Set up deployment from your Git repository
   - The following files are included for Azure deployment:
     - `web.config` - IIS configuration
     - `startup.txt` - Gunicorn startup command
     - `.deployment` - Deployment configuration
     - `deploy.sh` - Deployment script

3. **Environment Variables**
   - Set the following App Service configuration settings (optional):
     - `FLASK_SECRET_KEY` - A secure random string for Flask sessions
     - `PORT` - Will default to 5000 if not set

4. **Deployment**
   - The application will be automatically deployed based on your repository configuration
   - The deployment script will create a virtual environment and install dependencies

## Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python main.py
   ```

## File Renaming Logic

The application processes file names according to these patterns:
- Input format: `UPC-CODE_SIDE.ext`  (Example: `123-456-789_front.jpg`)
- Output format: `UPCCODE_SIDECODE.ext` (Example: `123456789_C1C1.jpg`)

Side codes are mapped as follows:
- `_front` → `_C1C1`
- `_back` → `_C7C1`
- `_left` → `_C2L1`
- `_right` → `_C8R1`
- `_top` → `_C3C1`
- `_bottom` → `_C9C1`
- `_nutrition` → `_L2`
- `_ingredients` → `_L4`
- `_upc` → `_upc`
