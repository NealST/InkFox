'use client';
import { useRef, useEffect, useCallback } from 'react';
import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCreateEditor } from './use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useSelectedArticle, IArticleState } from '../articles/controllers/selected-article';
import debounce from '@/utils/debounce';
import writeToFile from './controllers/write-to-file';
import useTextCount from './controllers/text-count';
import readArticle from './controllers/read-article';
import styles from './index.module.css';

const DELAY_TIME = 2000;

const MainEditor = function() {
  const editor = useCreateEditor();
  const selectedArticle = useSelectedArticle((state: IArticleState) => state.selectedArticle);
  const editorRef = useRef<HTMLDivElement>(null);
  const setTextCount = useTextCount(state => state.setCount);
  const articlePath = selectedArticle.path;
  const handleChange = useCallback(({value}) => {
    console.log("editor value", value);
    console.log("editor text content", editorRef.current?.textContent);
    // count the character number of editor
    setTextCount(editorRef.current?.textContent?.length || 0);
    // write edit content to file path automatically
    writeToFile(value, articlePath);
  }, [articlePath]);

  useEffect(() => {
    console.log('articlePath', articlePath);
    readArticle(articlePath).then(articleContent => {
      console.log('articleContent', articleContent);
      editor.tf.setValue(JSON.parse(articleContent || '[]'));
    });
  }, [articlePath]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={debounce(handleChange, DELAY_TIME)}
      >
        <EditorContainer>
          <Editor variant="demo" ref={editorRef} />
        </EditorContainer>
      </Plate>
    </DndProvider>
  )
};

export default MainEditor;
