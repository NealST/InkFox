'use client';

import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCreateEditor } from './use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import styles from './index.module.css';

const MainEditor = function() {
  const editor = useCreateEditor();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer className={styles.editor_container}>
          <Editor variant="demo" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  )
};

export default MainEditor;
