document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const submitBtn = document.getElementById('submitBtn');
    const processingAlert = document.getElementById('processingAlert');
    const errorAlert = document.getElementById('errorAlert');
    const dropZone = document.getElementById('dropZone');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        handleFiles(files);
    }

    // Handle the selected files
    function handleFiles(files) {
        fileList.innerHTML = '';
        if (files.length > 0) {
            const list = document.createElement('ul');
            list.className = 'list-group';
            
            Array.from(files).forEach(file => {
                const item = document.createElement('li');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = file.name;
                
                const sizeSpan = document.createElement('span');
                sizeSpan.className = 'badge bg-secondary';
                sizeSpan.textContent = formatFileSize(file.size);
                
                item.appendChild(nameSpan);
                item.appendChild(sizeSpan);
                list.appendChild(item);
            });
            
            fileList.appendChild(list);
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update file list when files are selected through the input
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (fileInput.files.length === 0) {
            showError('Please select at least one file.');
            return;
        }

        const formData = new FormData();
        Array.from(fileInput.files).forEach(file => {
            formData.append('files[]', file);
        });

        // Show processing message
        processingAlert.style.display = 'block';
        errorAlert.style.display = 'none';
        submitBtn.disabled = true;

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            return response.json().then(data => {
                throw new Error(data.error || 'Upload failed');
            });
        })
        .then(blob => {
            // Create and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'renamed_files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            // Reset form
            form.reset();
            fileList.innerHTML = '';
            processingAlert.style.display = 'none';
            submitBtn.disabled = false;
        })
        .catch(error => {
            showError(error.message);
            submitBtn.disabled = false;
            processingAlert.style.display = 'none';
        });
    });

    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        processingAlert.style.display = 'none';
    }
});
