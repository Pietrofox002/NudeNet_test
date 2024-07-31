use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use std::path::Path;
use std::fs;
use tauri::Manager;
use serde::{Deserialize, Serialize};
use walkdir::WalkDir;

#[derive(Debug, Deserialize)]
struct ScanParams {
    path: String,
    scan_subfolders: bool,
    min_size: u64,
    max_size: u64,
    extensions: Vec<String>,
}

#[derive(Clone, Serialize, Debug)]
struct ScanProgress {
    scanned_count: u32,
    nsfw_count: u32,
}

#[tauri::command]
async fn select_folder(
    window: tauri::Window,
    path: String,
    scan_subfolders: bool,
    min_size: u64,
    max_size: u64,
    extensions: Vec<String>,
) -> Result<(), String> {
    println!("Select folder function called");
    println!("Selected folder: {}", path);
    println!("Scan subfolders: {}", scan_subfolders);
    println!("Min size: {} KB", min_size);
    println!("Max size: {} KB", max_size);
    println!("Extensions: {:?}", extensions);

    let progress = Arc::new(Mutex::new(ScanProgress { scanned_count: 0, nsfw_count: 0 }));
    let progress_clone = Arc::clone(&progress);

    thread::spawn(move || {
        for entry in WalkDir::new(&path)
            .follow_links(true)
            .into_iter()
            .filter_entry(|e| scan_subfolders || e.depth() <= 1)
        {
            let entry = match entry {
                Ok(entry) => entry,
                Err(_) => continue,
            };

            if !entry.file_type().is_file() {
                continue;
            }

            let path = entry.path();
            if !is_valid_image(path, &extensions, min_size, max_size) {
                continue;
            }

            println!("Scanning image: {:?}", path);

            let mut progress = progress_clone.lock().unwrap();
            progress.scanned_count += 1;

            if is_image_nsfw(path) {
                progress.nsfw_count += 1;
                println!("NSFW image detected: {:?}", path);
            }

            // Emit progress update
            println!("Emitting progress: {:?}", progress);
            if let Err(e) = window.emit("scan_progress", &*progress) {
                println!("Error emitting event: {:?}", e);
            }

            // Simulate some processing time
            thread::sleep(Duration::from_millis(10));
        }
        println!("Scan completed");
    });

    Ok(())
}

fn is_valid_image(path: &Path, extensions: &[String], min_size: u64, max_size: u64) -> bool {
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

fn is_image_nsfw(path: &Path) -> bool {
    // Dummy implementation
    path.to_string_lossy().len() % 2 == 0
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![select_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

