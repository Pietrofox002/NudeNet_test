use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct ScanParams {
    pub path: String,
    pub scan_subfolders: bool,
    pub min_size: u64,
    pub max_size: u64,
    pub extensions: Vec<String>,
}

#[derive(Clone, Serialize, Debug)]
pub struct ScanProgress {
    pub scanned_count: u32,
    pub nsfw_count: u32,
}