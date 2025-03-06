# Requirements.txt Information

This file was automatically generated from pyproject.toml using Poetry's export functionality:
```
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

The requirements.txt file contains all necessary dependencies for the application, including:
- Flask
- Flask-SQLAlchemy
- Werkzeug
- Gunicorn (for Azure App Service deployment)
- Email-validator
- Psycopg2-binary

For Azure App Service deployment, Gunicorn was added as a dependency using Replit's packager tool, as it's required for the startup command specified in `startup.txt`.
