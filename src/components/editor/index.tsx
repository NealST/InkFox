import Header from './header';
import MainEditor from './main-editor';
import styles from './index.module.css';

const Editor = function() {
  return (
    <div className={styles.editor}>
      <Header />
      {/* <Toolbar /> */}
      <div className={styles.editor_main}>
        {/* <Content /> */}
        {/* <Outline /> */}
        <MainEditor />
      </div>
    </div>
  )
};

export default Editor;
