use std::path::Path;
use std::fs;

pub fn is_valid_image(path: &Path, extensions: &[String], min_size: u64, max_size: u64) -> bool {
    if let Some(ext) = path.extension() {
        if !extensions.iter().any(|e| ext.eq_ignore_ascii_case(e)) {
            return false;
        }
    } else {
        return false;
    }

    if let Ok(metadata) = fs::metadata(path) {
        let size = metadata.len() / 1024; // Convert to KB
        size >= min_size && size <= max_size
    } else {
        false
    }
}

pub fn is_image_nsfw(path: &Path) -> bool {
    // Dummy implementation
    path.to_string_lossy().len() % 2 == 0
}