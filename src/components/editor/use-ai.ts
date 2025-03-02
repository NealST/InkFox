// custom hook for ai use

import { useState, useEffect } from 'react';
import { useSettings } from '@/components/settings';
import { invoke, Channel } from '@tauri-apps/api/core';

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
}

interface ModelConfig {
  provider: "openai" | "deepseek" | "custom";
  modelName: string;
  apiKey: string;
  baseUrl?: string;
}

interface StreamChunk {
  content: string;
  isFinal: boolean;
  error?: string;
}

const onEvent = new Channel<StreamChunk>();
const useAI = function() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    onEvent.onmessage = function(msg: StreamChunk) {
      console.log('get message from ai', msg.content)
    };
  }, []);

  return {
    handleSubmit: () => {
      invoke('chat_stream', {
        request: {
          messages: [{
            id: Date.now().toString(),
            role: 'user',
            content: "帮我生成一段猫和老鼠的小故事"
          }],
          config: {
            provider: 'deepseek',
            model_name: 'deepseek-chat',
            api_key: 'sk-01df8dbdbf5f41b68fe84fabd3fe4505',
          }
        },
        onEvent
      })
    }
  }
};

export default useAI;
