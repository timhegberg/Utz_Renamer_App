import os
import logging
from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
import tempfile
import shutil
from utils import process_files, create_zip_archive

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your-secret-key-here')  # Get from environment or use default

# Configure upload settings
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files[]')

    if not files or files[0].filename == '':
        return jsonify({'error': 'No files selected'}), 400

    # Create temporary directories
    temp_dir = tempfile.mkdtemp()
    renamed_dir = tempfile.mkdtemp()

    try:
        # Save uploaded files to temp directory
        saved_files = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(temp_dir, filename)
                file.save(filepath)
                saved_files.append(filepath)

        if not saved_files:
            return jsonify({'error': 'No valid files uploaded'}), 400

        # Process files
        processed_files = process_files(saved_files, renamed_dir)

        if not processed_files:
            return jsonify({'error': 'No files could be processed'}), 400

        # Create ZIP archive
        zip_path = create_zip_archive(processed_files, "renamed_files.zip")

        # Send the ZIP file
        return send_file(
            zip_path,
            mimetype='application/zip',
            as_attachment=True,
            download_name='renamed_files.zip'
        )

    except Exception as e:
        logger.error(f"Error processing files: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

    finally:
        # Clean up temporary directories
        shutil.rmtree(temp_dir, ignore_errors=True)
        shutil.rmtree(renamed_dir, ignore_errors=True)

if __name__ == '__main__':
    # Get port from environment variable for Azure compatibility
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)