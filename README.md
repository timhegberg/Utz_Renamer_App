# 📷 Utz Renamer App

**Utz Renamer App** is a Flask-based web application that allows users to upload image files, process them, and download the processed files as a ZIP archive.

---

## 🚀 Features
✅ Upload multiple image files (`PNG`, `JPG`, `JPEG`, `GIF`)
✅ Process files (renaming, modifying, or other transformations)
✅ Download processed files as a `ZIP` archive
✅ Simple web-based interface

---

## 🛠️ How It Works

1. **User Uploads Images**: The user selects and uploads image files through the web interface.
2. **File Validation**: The application checks if the uploaded files are valid image formats.
3. **Processing Logic**:
   - The files are temporarily stored in a directory.
   - `utils.py` handles the processing logic, which may involve renaming or modifying the images.
   - The processed images are saved in a separate directory.
4. **ZIP File Creation**: After processing, the images are compressed into a ZIP archive.
5. **Download Processed Files**: The user can then download the ZIP file containing the processed images.

---

## 🛠 Installation

### 📌 Prerequisites
- Python `3.x`
- Flask
- Required dependencies listed in `pyproject.toml`

### 🔧 Setup
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd ImageMagicTool
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

---

## 📦 Dependencies
The following dependencies are used in this project:

- 🏗 **Flask** - Web framework for handling routes and user interactions.
- 🔒 **Werkzeug** - Secure filename handling.
- 📂 **tempfile** - Temporary directories for file storage.
- 📁 **shutil** - File and directory management.
- 📜 **logging** - Debugging and error tracking.
- 🔄 **jsonify (Flask)** - Structured JSON responses for API routes.

---

## 🚀 Usage
1. Run the Flask application:
   ```sh
   python main.py
   ```
2. Open a web browser and go to:
   ```sh
   http://127.0.0.1:5000
   ```
3. Upload images and download the processed ZIP file.

---

## 📂 Project Structure
```sh
ImageMagicTool/
│── main.py             # Main Flask application
│── utils.py            # Processing logic
│── templates/          # HTML templates
│── static/             # Static assets (CSS, JS, images)
│── pyproject.toml      # Project dependencies and configuration
│── requirements.txt    # List of dependencies
```

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push to the branch and submit a pull request.

---

## 📜 License
This project is licensed under the **MIT License**.
