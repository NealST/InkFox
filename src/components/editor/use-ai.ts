// custom hook for ai use

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
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

const useAI = function () {
  const { settings } = useSettings();
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const receivedMsgRef = useRef('');
  const onEvent = useMemo(() => {
    return new Channel<StreamChunk>();
  }, []);
  
  useEffect(() => {
    onEvent.onmessage = (msg: StreamChunk) => {
      console.log("get message from ai", msg.content);
      setLoading(false);
      receivedMsgRef.current = receivedMsgRef.current + msg.content;
      requestAnimationFrame(() => {
        setMessages(pre => {
          const newMsgs = ([] as Message[]).concat(pre);
          const len = newMsgs.length;
          newMsgs[len - 1].content = receivedMsgRef.current;
          return newMsgs;
        });
      });
    }

    return () => {
      delete (window as any).__TAURI_IPC__?.callbacks[onEvent.id];
    }
  }, []);

  const handleSubmit = async function () {
    if (!input.trim() || isLoading) {
      return;
    }
    setLoading(true);
    setInput("");
    receivedMsgRef.current = '';
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
      receivedMsgRef.current = '';
      setError(e);
      setLoading(false);
    }
  };

  const append = async function(messageItem: Message, system: string) {
    setLoading(true);
    receivedMsgRef.current = '';
    const newMsgId = uid();
    const newMsgItem = {
      ...messageItem,
      id: newMsgId,
    };
    console.log('newMsgItem', newMsgItem);
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
              content: system.body.system
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
      receivedMsgRef.current = '';
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
