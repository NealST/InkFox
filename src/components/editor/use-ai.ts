// custom hook for ai use

import { useState, useEffect } from "react";
import { useSettings } from "@/components/settings";
import { invoke, Channel } from "@tauri-apps/api/core";

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
const useAI = function () {
  const { settings } = useSettings();
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    onEvent.onmessage = function (msg: StreamChunk) {
      console.log("get message from ai", msg.content);
    };
  }, []);

  const handleSubmit = async function () {
    if (!input.trim() || isLoading) {
      return;
    }
    setLoading(true);
    setInput("");
    try {
      await invoke("chat_stream", {
        request: {
          messages: [
            {
              id: Date.now().toString(),
              role: "user",
              content: input,
            },
          ],
          config: {
            provider: "deepseek",
            model_name: "deepseek-chat",
            api_key: settings.modelApiKey,
          },
        },
        onEvent,
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
  };
};

export default useAI;
