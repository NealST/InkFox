// custom hook for ai use

import { useState, useEffect } from "react";
import { useSettings } from "@/components/settings";
import { invoke, Channel } from "@tauri-apps/api/core";
import { uid } from 'uid';

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
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    onEvent.onmessage = function (msg: StreamChunk) {
      console.log("get message from ai", msg.content);
      setLoading(false);
      setMessages(pre => {
        const len = pre.length;
        const lastContent = pre[len - 1].content;
        pre[len - 1].content = lastContent + msg.content;
        return pre;
      });
    };
  }, []);

  const handleSubmit = async function () {
    if (!input.trim() || isLoading) {
      return;
    }
    setLoading(true);
    setInput("");
    setMessages(pre => {
      return pre.concat([
        {
          id: uid(),
          role: 'user',
          content: input,
        },
        {
          id: uid(),
          role: 'assistant',
          content: ''
        }
      ]);
    });
    try {
      await invoke("chat_stream", {
        request: {
          messages: [
            {
              id: uid(),
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
      setError(e);
      setLoading(false);
    }
  };

  const append = async function(messageItem: Message, system: string) {
    setLoading(true);
    const newMsgId = uid();
    const newMsgItem = {
      ...messageItem,
      id: newMsgId,
    };
    console.log("system", system);
    setMessages(pre => {
      return pre.concat([newMsgItem, {
        id: uid(),
        role: 'assistant',
        content: ''
      }]);
    });
    try {
      await invoke("chat_stream", {
        request: {
          messages: [
            {
              id: uid(),
              role: 'system',
              content: system
            },
            newMsgItem
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
      console.log('e', e);
      setError(e);
      setLoading(false);
    }
  }

  return {
    isLoading,
    messages,
    input,
    setInput,
    handleSubmit,
    error,
    append,
  };
};

export default useAI;
