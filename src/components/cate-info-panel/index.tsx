import DefaultContent from './default-content';
import Editor from '../editor';
import { useSelectedCate, type ICateState } from '../cates/controllers/selected-cate';
import { useSelectedArticle, type IArticleState } from '../articles/controllers/selected-article';
import styles from './index.module.css';

const MainPanel = function() {

  const selectedCate = useSelectedCate((state: ICateState) => state.name);
  const selectedArticle = useSelectedArticle((state: IArticleState) => state.selectedArticle);
  const showEditor = selectedCate && selectedArticle && selectedArticle?.metadata?.is_file;

  return (
    <div className={styles.main_panel}>
      {
        showEditor ? (
          <Editor />
        ) : (
          <DefaultContent />
        )
      }
    </div>
  )
};

export default MainPanel;
