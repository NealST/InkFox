import { bindFirst, type SlateEditor } from "@udecode/plate";
import { createTPlatePlugin, getEditorPlugin } from "@udecode/plate/react";
import {
  withAIChat,
  useAIChatHooks,
  AIPlugin,
  getEditorPrompt,
  resetAIChat,
  acceptAIChat,
  insertBelowAIChat,
  replaceSelectionAIChat,
} from "@udecode/plate-ai/react";
import { BlockSelectionPlugin } from "@udecode/plate-selection/react";
import { isSelecting } from "@udecode/plate-selection";

const submitAIChat = (editor, { mode, options, prompt, system } = {}) => {
  const { getOptions, setOption } = getEditorPlugin(editor, {
    key: "aiChat",
  });
  const { chat, promptTemplate, systemTemplate } = getOptions();
  if (!prompt && chat.input?.length === 0) {
    return;
  }
  if (!prompt) {
    prompt = chat.input;
  }
  console.log('promt', prompt);
  if (!mode) {
    mode = isSelecting(editor) ? "chat" : "insert";
  }
  if (mode === "insert") {
    editor.getTransforms(AIPlugin).ai.undo();
  }
  setOption("mode", mode);
  chat.setInput?.("");
  console.log('prompt', prompt);
  void chat.append?.(
    {
      content:
        getEditorPrompt(editor, {
          prompt,
          promptTemplate,
        }) ?? "",
      role: "user",
    },
    {
      body: {
        system: getEditorPrompt(editor, {
          prompt: system,
          promptTemplate: systemTemplate,
        }),
      },
      ...options,
    }
  );
};

const AIChatPlugin = createTPlatePlugin({
  key: "aiChat",
  dependencies: ["ai"],
  options: {
    aiEditor: null,
    chat: { messages: [] },
    mode: "chat",
    open: false,
    promptTemplate: () => "{prompt}",
    systemTemplate: () => {},
    trigger: " ",
    triggerPreviousCharPattern: /^\s?$/,
  },
})
  .overrideEditor(withAIChat)
  .extend(() => ({
    useHooks: useAIChatHooks,
  }))
  .extendApi(({ editor, getOptions }) => {
    return {
      reload: () => {
        const { chat, mode } = getOptions();
        if (mode === "insert") {
          editor.getTransforms(AIPlugin).ai.undo();
        }
        void chat.reload?.({
          body: {
            system: getEditorPrompt(editor, {
              promptTemplate: getOptions().systemTemplate,
            }),
          },
        });
      },
      reset: bindFirst(resetAIChat, editor),
      stop: () => {
        getOptions().chat.stop?.();
      },
      submit: bindFirst(submitAIChat, editor),
    };
  })
  .extendApi(({ api, editor, getOptions, setOption }) => ({
    hide: () => {
      api.aiChat.reset();
      setOption("open", false);
      if (editor.getOption(BlockSelectionPlugin, "isSelectingSome")) {
      } else {
        editor.tf.focus();
      }
      const lastBatch = editor.history.undos.at(-1);
      if (lastBatch?.ai) {
        delete lastBatch.ai;
      }
    },
    show: () => {
      api.aiChat.reset();
      getOptions().chat.setMessages?.([]);
      setOption("open", true);
    },
  }))
  .extendTransforms(({ editor }: { editor: SlateEditor }) => ({
    accept: bindFirst(acceptAIChat, editor),
    insertBelow: bindFirst(insertBelowAIChat, editor),
    replaceSelection: bindFirst(replaceSelectionAIChat, editor),
  }));

export default AIChatPlugin;
