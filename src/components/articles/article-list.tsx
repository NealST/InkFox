import type { IArticleItem } from './types';
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Input } from '../ui/input';
import { Group } from 'lucide-react';
import getArticles from './controllers/get-articles';
import createArticle from './controllers/create-article';
import createGroup from './controllers/create-group';
import { useSelectedArticle, IArticleState } from './controllers/selected-article';
import styles from './index.module.css';

interface IProps {
  parentPath: string;
}

const ArticleList = function(props: IProps) {
  const { parentPath } = props;
  const [dataSource, setDataSource] = useState([] as IArticleItem[]);
  const newArticleNameRef = useRef('');

  useEffect(() => {
    getArticles(parentPath).then(ret => {
      setDataSource(ret);
    });
  }, [parentPath]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    newArticleNameRef.current = event.target.value;
  }

  function handleInputBlur() {
    const newArticles = ([] as IArticleItem[]).concat(dataSource);
    const newArticleName = newArticleNameRef.current;
    if (!newArticleName) {
      newArticles.shift();
      setDataSource(newArticles);
      return;
    }
    createArticle(parentPath, newArticleName)
      .then(() => {
        newArticles[0] = {
          type: "group",
          name: newArticleName,
        };
        setDataSource(newArticles);
        // setSelectedArticle(newArticleName);
        newArticleNameRef.current = '';
      })
      .catch(() => {
        newArticles.shift();
        setDataSource(newArticles);
        newArticleNameRef.current = '';
      });
  }

  return (
    <div className={styles.article_list}>
      {
        dataSource.length > 0 && dataSource.map(item => {
          const { type, name, action, children } = item;
          if (action) {
            return (
              <div className={styles.article_item}>
                <Group />
                <Input className={styles.item_input} onInput={handleInputChange} onBlur={handleInputBlur} />
              </div>
            )
          }
          return type === 'file' ? (
            <div className={styles.article_file}>
            </div>
          ) : (
            <div className={styles.article_group}>
              <Group />
              
            </div>
          )
        })
      }
    </div>
  )
}

export default ArticleList;
