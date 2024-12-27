import { useEffect, useState } from "react";
import type { IArticleItem } from "./types";
import getArticles from "./controllers/get-articles";
import createArticle from "./controllers/create-article";
import { useSelectedArticle, type IArticleState } from './controllers/selected-article';
import { useSelectedCate, type ICateState } from "../cates/controllers/selected-cate";
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";
import styles from './index.module.css';

const Articles = function() {

  const selectedCate = useSelectedCate((state: ICateState) => state.name);
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([] as IArticleItem[]);
  const [activeNav, setActiveNav] = useState('home');
  const [isCollapseAll, setCollapseAll] = useState(false);

  useEffect(() => {
    getArticles(selectedCate).then(ret => {
      setDataSource(ret);
    });
  }, []);
  
  return (
    <div className={styles.articles}>
      <div className={styles.articles_header}>
        <span>
          <Icon icon="flat-color-icons:folder" width="48" height="48" />
          <span className={styles.header_title}>{selectedCate}</span>
        </span>
        <Icon icon="f7:plus-app-fill" width="48" height="48" />
      </div>
      <div className={styles.articles_home} onClick={() => setActiveNav('home')}>
        <Icon icon="material-symbols-light:home-outline-rounded" width="24" height="24" />
        <span className={styles.home_text}>{t('home')}</span>
      </div>
      <div className={styles.articles_dir}>
        <span>
          <Icon icon="clarity:tree-view-line" width="36" height="36" />
          <span className={styles.dir_text}>{t('folders')}</span>
        </span>
        <span>
          <Icon icon="iconoir:position" width="24" height="24" />
          <Icon icon={isCollapseAll ? 'ri:menu-fold-4-line' : 'carbon:collapse-categories'} width="24" height="24" />
        </span>
      </div>
      <div className={styles.articles_groups}>

      </div>
    </div>
  )

};

export default Articles;
