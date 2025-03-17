// src-tauri/src/main.rs

use tauri::{AppHandle, ipc::Channel};
use async_openai::{
    config::OpenAIConfig,
    Client,
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestUserMessage, ChatCompletionRequestUserMessageContent,
        ChatCompletionRequestAssistantMessage, ChatCompletionRequestSystemMessage,
        CreateChatCompletionRequestArgs, ChatCompletionRequestSystemMessageContent, ChatCompletionRequestAssistantMessageContent
    }
};
use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;
use tokio_stream::StreamExt;
use url::Url;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ModelProvider {
    OpenAI,
    DeepSeek,
    Custom,
}

#[derive(Debug, Deserialize)]
pub struct ModelConfig {
    provider: ModelProvider,
    model_name: String,
    api_key: String,
    base_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ChatRequest {
    messages: Vec<serde_json::Value>,
    config: ModelConfig,
}

#[derive(Clone, Serialize)]
pub struct StreamChunk {
    content: String,
    #[serde(rename = "isFinal")]
    is_final: bool,
    error: Option<String>,
}

fn build_messages(messages: &[serde_json::Value]) -> Result<Vec<ChatCompletionRequestMessage>, String> {
    messages.iter().map(|m| {
        let role = m.get("role").and_then(|v| v.as_str()).ok_or("Missing role")?;
        let content = m.get("content").and_then(|v| v.as_str()).ok_or("Missing content")?;

        Ok(match role.to_lowercase().as_str() {
            "system" => ChatCompletionRequestMessage::System(
                ChatCompletionRequestSystemMessage {
                    content: ChatCompletionRequestSystemMessageContent::Text(content.to_string()),
                    name: None,
                }
            ),
            "user" => ChatCompletionRequestMessage::User(
                ChatCompletionRequestUserMessage {
                  content: ChatCompletionRequestUserMessageContent::Text(content.to_string()),
                  name: None,
                }
            ),
            "assistant" => ChatCompletionRequestMessage::Assistant(
                ChatCompletionRequestAssistantMessage {
                    content: Some(ChatCompletionRequestAssistantMessageContent::Text(content.to_string())),
                    name: None,
                    tool_calls: None,
                    refusal: None,
                    audio: None,
                    function_call: None,
                }
            ),
            _ => return Err(format!("Invalid role: {}", role)),
        })
    }).collect()
}

async fn create_client(config: &ModelConfig) -> Result<Client<OpenAIConfig>, String> {
    let api_base = match &config.provider {
        ModelProvider::OpenAI => config.base_url
            .as_deref()
            .unwrap_or("https://api.openai.com/v1"),
        ModelProvider::DeepSeek => config.base_url
            .as_deref()
            .unwrap_or("https://api.deepseek.com"),
        ModelProvider::Custom => config.base_url
            .as_deref()
            .ok_or("Custom provider requires base_url")?,
    };

    let url = Url::parse(api_base)
        .map_err(|e| format!("Invalid base URL: {}", e))?;

    Ok(Client::with_config(
        OpenAIConfig::new()
            .with_api_key(&config.api_key)
            .with_api_base(url.to_string())
    ))
}

#[tauri::command]
pub async fn chat_stream(request: ChatRequest, on_event: Channel<StreamChunk>) -> Result<(), String> {
    let (tx, mut rx) = mpsc::channel(32);
    let model_name = request.config.model_name.clone();
    
    // Build messages
    let messages = match build_messages(&request.messages) {
        Ok(m) => m,
        Err(e) => {
            println!("build_messages error, {}", e);
            return Err(e);
        }
    };

    // Create client
    let client = match create_client(&request.config).await {
        Ok(c) => c,
        Err(e) => {
            println!("create_client error, {}", e);
            return Err(e);
        }
    };

    // Build request
    let request = match CreateChatCompletionRequestArgs::default()
        .model(&model_name)
        .messages(messages)
        .stream(true)
        .build()
    {
        Ok(r) => r,
        Err(e) => {
            println!("build_request error, {}", e.to_string());
            return Err(e.to_string());
        }
    };

    let on_event_clone = on_event.clone();

    // Spawn streaming task
    tokio::spawn(async move {
        match client.chat().create_stream(request).await {
            Ok(mut stream) => {
                while let Some(response) = stream.next().await {
                    match response {
                        Ok(chat_response) => {
                            let content = chat_response.choices[0]
                                .delta.content.clone()
                                .unwrap_or_default();
                            
                            if !content.is_empty() {
                                on_event_clone.send(StreamChunk {
                                    content,
                                    is_final: false,
                                    error: None,
                                }).unwrap();
                            }
                        }
                        Err(e) => {
                            println!("ai stream error, {}", e.to_string());
                            on_event_clone.send(StreamChunk {
                                content: String::new(),
                                is_final: true,
                                error: Some(e.to_string()),
                            }).unwrap();
                            break;
                        }
                    }
                }
                on_event_clone.send(StreamChunk {
                    content: String::new(),
                    is_final: true,
                    error: None,
                }).unwrap();
            }
            Err(e) => {
                println!("create stream error, {}", e.to_string());
                on_event_clone.send(StreamChunk {
                    content: String::new(),
                    is_final: true,
                    error: Some(e.to_string()),
                }).unwrap();
            }
        }
    });

    // Forward chunks to frontend
    while let Some(chunk) = rx.recv().await {
        on_event.send(chunk).unwrap()
    }

    Ok(())
}
