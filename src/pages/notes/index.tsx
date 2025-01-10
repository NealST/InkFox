import Articles from '@/components/articles';
import Editor from '@/components/editor';
import styles from './index.module.css';

const Notes = function() {
  return (
    <div className={styles.notes}>
      <Articles />
      <Editor />
    </div>
  )
};

export default Notes;
