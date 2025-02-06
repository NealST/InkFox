use std::fs::{self};
use std::io;
use std::path::Path;
use serde::Serialize;
use std::time::SystemTime;
use std::fmt;

#[derive(Debug, Serialize)]
struct FileMeta {
  len: u64,
  created: SystemTime,
  modified: SystemTime,
}

#[derive(Debug, Serialize)]
pub struct FileInfo {
  path: String,
  metadata: FileMeta
}

#[derive(Debug, Serialize)]
pub struct DirectoryInfo {
  pub path: String,
  pub files: Vec<FileInfo>,
  pub subdirectories: Vec<DirectoryInfo>,
}

impl fmt::Display for DirectoryInfo {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "({})", self.path)
  }
}

pub fn read_dir_recursive(path: &Path) -> io::Result<DirectoryInfo> {
  let mut files = Vec::new();
  let mut subdirectories = Vec::new();

  for entry in fs::read_dir(path)? {
    let entry = entry?;
    let entry_path = entry.path();

    if entry_path.is_dir() {
      subdirectories.push(read_dir_recursive(&entry_path)?);
    } else {
      let metadata = entry.metadata()?;
      files.push(FileInfo {
        path: entry_path.to_string_lossy().to_string(),
        metadata: FileMeta {
          len: metadata.len(),
          created: metadata.created()?,
          modified: metadata.modified()?,
        }
      });
    }
  }

  Ok(DirectoryInfo {
    path: path.to_string_lossy().to_string(),
    files,
    subdirectories,
  })
}
