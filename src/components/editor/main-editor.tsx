'use client';

import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCreateEditor } from './use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useSelectedArticle, IArticleState } from '../articles/controllers/selected-article';
import debounce from '@/utils/debounce';
import writeToFile from './controllers/write-to-file';
import styles from './index.module.css';

const DELAY_TIME = 1500;

const MainEditor = function() {
  const editor = useCreateEditor();
  const selectedArticle = useSelectedArticle((state: IArticleState) => state.selectedArticle);
  const handleChange = function({value}) {
    console.log("editor value", value);
    // write edit content to file path automatically
    writeToFile(value, selectedArticle.path);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate 
        editor={editor}
        onChange={debounce(handleChange, DELAY_TIME)}
      >
        <EditorContainer className={styles.editor_container}>
          <Editor variant="demo" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  )
};

export default MainEditor;
