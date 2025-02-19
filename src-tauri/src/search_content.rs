use walkdir::WalkDir;
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use regex::Regex;
use tokio::task;
use futures::stream::{self, StreamExt};
use serde::{Serialize, Deserialize};
use std::sync::{Arc};
use parking_lot::Mutex;

#[derive(Serialize, Deserialize, Debug)]
struct SearchResult {
    file_path: String,
    line_number: usize,
    line_content: String,
}

async fn search_files(path: &str, pattern: &str) -> io::Result<Vec<SearchResult>> {
    let regex = Regex::new(pattern).unwrap();
    let mut entries = Vec::new();

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.path().is_file() {
            entries.push(entry.into_path());
        }
    }

    let results = Arc::new(Mutex::new(Vec::new()));

    stream::iter(entries)
        .for_each_concurrent(None, |path| {
            let regex = regex.clone();
            let results = Arc::clone(&results);
            async move {
                match search_in_file(path.clone(), &regex).await {
                    Ok(Some((line, line_number))) => {
                        let mut results = results.lock();
                        results.push(SearchResult {
                            file_path: path.to_string_lossy().to_string(),
                            line_number,
                            line_content: line,
                        });
                    }
                    Ok(None) => (),
                    Err(err) => eprintln!("Error reading file {:?}: {}", path, err),
                }
            }
        })
        .await;

    let results = Arc::try_unwrap(results).expect("Arc unwrap failed").into_inner();
    Ok(results)
}

async fn search_in_file<P: AsRef<Path>>(path: P, regex: &Regex) -> io::Result<Option<(String, usize)>> {
    let file = File::open(path)?;
    let reader = io::BufReader::new(file);

    for (line_number, line) in reader.lines().enumerate() {
        let line = line?;
        if regex.is_match(&line) {
            return Ok(Some((line, line_number + 1)));
        }
    }

    Ok(None)
}
