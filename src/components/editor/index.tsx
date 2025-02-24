import Header from './header';
import MainEditor from './main-editor';
import { motion } from 'motion/react';
import useFocusMode from './controllers/focus-mode';
import styles from './index.module.css';

const Editor = function() {

  const {isFocusMode, setFocusMode} = useFocusMode();

  const handleToggleFocusMode = function(focusMode: boolean) {
    setFocusMode(focusMode);
  }

  return (
    <motion.div 
      className={styles.editor} 
      animate={{
        width: isFocusMode ? '100vw' : 'calc(100vw - 460px)'
      }}
    >
      <Header onToggleFocusMode={handleToggleFocusMode} isFocusMode={isFocusMode} />
      <div className={styles.editor_main}>
        <MainEditor />
      </div>
    </motion.div>
  )
};

export default Editor;
