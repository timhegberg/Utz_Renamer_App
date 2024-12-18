import os
import re
import shutil
import logging
import zipfile
import tempfile

logger = logging.getLogger(__name__)

# Side code mapping
SIDE_CODE_MAP = {
    "_front": "_C1C1",
    "_back": "_C7C1",
    "_left": "_C2L1",
    "_right": "_C8R1",
    "_top": "_C3C1",
    "_bottom": "_C9C1",
    "_nutrition": "_L2",
    "_ingredients": "_L4",
    "_upc": "_upc"
}

def process_filename(filename):
    """Process a filename according to the specified patterns."""
    # Split filename and extension
    base_name = os.path.splitext(filename)[0]
    extension = os.path.splitext(filename)[1].lower()
    
    # Pattern for UPC code and side code
    upc_pattern = r'([0-9]+-[0-9]+-[0-9]+)'
    side_pattern = r'(_(?:front|back|left|right|top|bottom|nutrition|ingredients|upc))'
    
    # Extract UPC code from the start of the filename
    upc_match = re.match(upc_pattern, base_name)
    if not upc_match:
        logger.warning(f"No valid UPC code found in filename: {filename}")
        return None
        
    # Find the last occurrence of a valid side code
    side_matches = re.finditer(side_pattern, base_name.lower())
    side_match = None
    for match in side_matches:
        side_match = match
    
    if not side_match:
        logger.warning(f"No valid side code found in filename: {filename}")
        return None
        
    upc_code = upc_match.group(1)
    side_code = side_match.group(1)
    
    if not match:
        logger.warning(f"Filename {filename} does not match required pattern")
        return None
    
    upc_code, side_code = match.groups()
    
    # Check if side code is valid
    if side_code not in SIDE_CODE_MAP:
        logger.warning(f"Invalid side code in filename: {filename}")
        return None
    
    # Remove hyphens from UPC code
    clean_upc = upc_code.replace('-', '')
    
    # Get mapped side code
    mapped_side_code = SIDE_CODE_MAP[side_code]
    
    # Create new filename
    new_filename = f"{clean_upc}{mapped_side_code}{extension}"
    
    return new_filename

def process_files(file_paths, output_dir):
    """Process multiple files and return list of processed file paths."""
    processed_files = []
    
    for file_path in file_paths:
        try:
            original_filename = os.path.basename(file_path)
            new_filename = process_filename(original_filename)
            
            if new_filename:
                new_path = os.path.join(output_dir, new_filename)
                shutil.copy2(file_path, new_path)
                processed_files.append(new_path)
            else:
                logger.warning(f"Skipping file: {original_filename}")
                
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            continue
    
    return processed_files

def create_zip_archive(file_paths, zip_name):
    """Create a ZIP archive containing the specified files."""
    temp_zip = os.path.join(tempfile.gettempdir(), zip_name)
    
    with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in file_paths:
            zipf.write(file_path, os.path.basename(file_path))
    
    return temp_zip
