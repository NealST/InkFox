// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window};
use async_openai::{
    types::{CreateChatCompletionRequestArgs, Role, ChatCompletionRequestMessageArgs},
    Client,
};
use serde::Serialize;
use tokio::sync::mpsc;

// 定义 IPC 消息结构
#[derive(Clone, Serialize)]
struct StreamResponse {
    content: String,
    is_final: bool,
    error: Option<String>,
}

#[tauri::command]
pub async fn chat_stream(window: Window, messages: Vec<serde_json::Value>) -> Result<(), String> {
    // 转换消息格式
    let oai_messages: Vec<_> = messages
        .iter()
        .filter_map(|m| {
            let role = m.get("role")?.as_str()?;
            let content = m.get("content")?.as_str()?;
            
            ChatCompletionRequestMessageArgs::default()
                .role(match role {
                    "user" => Role::User,
                    "assistant" => Role::Assistant,
                    _ => Role::System,
                })
                .content(content)
                .build()
                .ok()
        })
        .collect();

    // 创建 OpenAI 客户端
    let client = Client::new().with_api_key(
        std::env::var("OPENAI_API_KEY").map_err(|_| "Missing OpenAI API key".to_string())?
    );

    // 创建流式请求
    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-3.5-turbo")
        .messages(oai_messages)
        .stream(true)
        .build()
        .map_err(|e| e.to_string())?;

    // 创建异步通道
    let (tx, mut rx) = mspc::channel(32);

    // 启动流处理任务
    tauri::async_runtime::spawn(async move {
        match client.chat().create_stream(request).await {
            Ok(mut stream) => {
                while let Some(response) = stream.next().await {
                    match response {
                        Ok(chat_response) => {
                            let content = chat_response.choices[0]
                                .delta
                                .content
                                .clone()
                                .unwrap_or_default();
                            
                            if !content.is_empty() {
                                let _ = tx.send(StreamResponse {
                                    content,
                                    is_final: false,
                                    error: None,
                                }).await;
                            }
                        }
                        Err(e) => {
                            let _ = tx.send(StreamResponse {
                                content: String::new(),
                                is_final: true,
                                error: Some(e.to_string()),
                            }).await;
                            break;
                        }
                    }
                }
                
                // 发送结束标记
                let _ = tx.send(StreamResponse {
                    content: String::new(),
                    is_final: true,
                    error: None,
                }).await;
            }
            Err(e) => {
                let _ = tx.send(StreamResponse {
                    content: String::new(),
                    is_final: true,
                    error: Some(e.to_string()),
                }).await;
            }
        }
    });

    // 监听通道并转发到前端
    while let Some(response) = rx.recv().await {
        window.emit("ai-stream", response)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
