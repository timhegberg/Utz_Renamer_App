document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const submitBtn = document.getElementById('submitBtn');
    const processingAlert = document.getElementById('processingAlert');
    const errorAlert = document.getElementById('errorAlert');
    const dropZone = document.getElementById('dropZone');
    const themeToggle = document.getElementById('themeToggle');
    
    // Initialize all tooltips and popovers
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            delay: { show: 1000, hide: 0 }
        });
    });

    const popovers = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popovers.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'click',
            container: 'body'
        });
    });

    // Close popover when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-bs-toggle="popover"]')) {
            popovers.forEach(function (popover) {
                const popoverInstance = bootstrap.Popover.getInstance(popover);
                if (popoverInstance) {
                    popoverInstance.hide();
                }
            });
        }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + U for file upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            fileInput.click();
        }
        // Ctrl/Cmd + Enter for submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!submitBtn.disabled) {
                submitBtn.click();
            }
        }
        // Ctrl/Cmd + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // Theme management
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    let dragCounter = 0;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Handle drag events on the drop zone
    dropZone.addEventListener('dragenter', (e) => {
        preventDefaults(e);
        dragCounter++;
        highlight();
    });

    dropZone.addEventListener('dragleave', (e) => {
        preventDefaults(e);
        dragCounter--;
        if (dragCounter === 0) {
            unhighlight();
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        preventDefaults(e);
        highlight();
    });

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        preventDefaults(e);
        unhighlight();
        dragCounter = 0;
        handleDrop(e);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropZone.classList.add('dragover');
        dropZone.querySelector('.upload-prompt').classList.add('opacity-75');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
        dropZone.querySelector('.upload-prompt').classList.remove('opacity-75');
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
                item.className = 'list-group-item';
                
                const topRow = document.createElement('div');
                topRow.className = 'd-flex justify-content-between align-items-center mb-2';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'fw-bold preview-rename';
                nameSpan.textContent = file.name;
                
                const sizeSpan = document.createElement('span');
                sizeSpan.className = 'badge bg-secondary';
                sizeSpan.textContent = formatFileSize(file.size);
                
                topRow.appendChild(nameSpan);
                topRow.appendChild(sizeSpan);
                
                const previewRow = document.createElement('div');
                previewRow.className = 'ms-4 position-relative preview-rename';
                
                const arrowIcon = document.createElement('i');
                arrowIcon.className = 'bi bi-arrow-right position-absolute start-0 ms-n4 mt-1';
                arrowIcon.setAttribute('aria-hidden', 'true');
                
                const previewText = document.createElement('span');
                previewText.textContent = generatePreviewName(file.name);
                
                previewRow.appendChild(arrowIcon);
                previewRow.appendChild(previewText);
                
                item.appendChild(topRow);
                item.appendChild(previewRow);
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

    function generatePreviewName(filename) {
        const sideCodeMap = {
            '_front': '_C1C1',
            '_back': '_C7C1',
            '_left': '_C2L1',
            '_right': '_C8R1',
            '_top': '_C3C1',
            '_bottom': '_C9C1',
            '_nutrition': '_L2',
            '_ingredients': '_L4',
            '_upc': '_upc'
        };
        
        // Extract potential UPC and side code from any part of the filename
        const upcPattern = /([0-9]+-[0-9]+-[0-9]+)/;
        const sidePattern = /_(front|back|left|right|top|bottom|nutrition|ingredients|upc)\b/i;
        
        const upcMatch = filename.match(upcPattern);
        const sideMatch = filename.match(sidePattern);
        
        if (!upcMatch || !sideMatch) {
            return 'Example: 123-456-789_front.jpg → 123456789_C1C1.jpg';
        }
        
        const upc = upcMatch[1];
        const side = '_' + sideMatch[1].toLowerCase();
        
        const ext = filename.split('.').pop();
        const cleanUpc = upc.replace(/-/g, '');
        const mappedSide = sideCodeMap[side] || '';
        
        return `${filename} → ${cleanUpc}${mappedSide}.${ext}`;
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
