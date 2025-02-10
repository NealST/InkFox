use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use walkdir::WalkDir;
use std::fs::metadata;
use chrono::{DateTime, Local};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
struct FileInfo {
  id: String,
  name: String,
  path: String,
  metadata: MetadataInfo,
  children: Option<Vec<FileInfo>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct MetadataInfo {
  is_file: bool,
  is_dir: bool,
  len: u64,
  created: Option<String>,
  modified: Option<String>,
}

fn get_metadata_info(metadata: fs::Metadata) -> MetadataInfo {
  let created = metadata.created()
        .ok()
        .and_then(|time| DateTime::<Local>::from(time).to_rfc3339().parse().ok());
    let modified = metadata.modified()
        .ok()
        .and_then(|time| DateTime::<Local>::from(time).to_rfc3339().parse().ok());

    MetadataInfo {
        is_file: metadata.is_file(),
        is_dir: metadata.is_dir(),
        len: metadata.len(),
        created,
        modified,
    }
}

fn get_file_info(path: PathBuf) -> FileInfo {
    let metadata = fs::metadata(&path).unwrap();
    let name = path.file_name().unwrap().to_string_lossy().to_string();
    let path = path.to_string_lossy().to_string();
    let id = Uuid::new_v4().to_string();
    let metadata_info = get_metadata_info(metadata);

    FileInfo {
        id,
        name,
        path,
        metadata: metadata_info,
        children: None,
    }
}

fn build_file_tree(path: &PathBuf) -> FileInfo {
    let mut file_info = get_file_info(path.clone());

    if metadata(path).unwrap().is_dir() {
        let children: Vec<FileInfo> = WalkDir::new(path)
            .min_depth(1)
            .into_iter()
            .filter_map(|entry| entry.ok())
            .map(|entry| build_file_tree(&entry.path().to_path_buf()))
            .collect();
        
        file_info.children = Some(children);
    }

    file_info
}

pub fn read_dir_recursive(path: &str) -> String {
    let path = PathBuf::from(path);
    let file_tree = build_file_tree(&path);

    // 将结果序列化为 JSON
    let json_result = serde_json::to_string_pretty(&file_tree).unwrap();

    json_result
}
