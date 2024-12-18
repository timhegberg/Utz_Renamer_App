document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const submitBtn = document.getElementById('submitBtn');
    const processingAlert = document.getElementById('processingAlert');
    const errorAlert = document.getElementById('errorAlert');

    // Update file list when files are selected
    fileInput.addEventListener('change', function() {
        fileList.innerHTML = '';
        if (this.files.length > 0) {
            const list = document.createElement('ul');
            list.className = 'list-group';
            
            Array.from(this.files).forEach(file => {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.textContent = file.name;
                list.appendChild(item);
            });
            
            fileList.appendChild(list);
        }
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
