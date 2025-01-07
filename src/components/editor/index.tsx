import Header from './header';
import Toolbar from './toolbar';
import Content from './content';
import Outline from './outline';
import styles from './index.module.css';

const Editor = function() {
  return (
    <div className={styles.editor}>
      <Header />
      <Toolbar />
      <div className={styles.editor_main}>
        <Content />
        <Outline />
      </div>
    </div>
  )
};

export default Editor;
