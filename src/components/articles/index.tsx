import { useEffect, useState } from "react";
import type { IArticleItem } from "./types";
import getArticles from "./controllers/get-articles";
import createArticle from "./controllers/create-article";
import {
  useSelectedArticle,
  type IArticleState,
} from "./controllers/selected-article";
import {
  useSelectedCate,
  type ICateState,
} from "../cates/controllers/selected-cate";
import {
  ChevronDown,
  SquarePlus,
  Folder,
  FolderInput,
  House,
  ListTree,
  Locate,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const Articles = function () {
  const selectedCate = useSelectedCate((state: ICateState) => state.name);
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([] as IArticleItem[]);
  const [activeNav, setActiveNav] = useState("home");
  const [isCollapseAll, setCollapseAll] = useState(false);

  useEffect(() => {
    getArticles(selectedCate).then((ret) => {
      setDataSource(ret);
    });
  }, [selectedCate]);

  return (
    <div className={styles.articles}>
      <div className={styles.articles_header}>
        <div className={styles.header_label}>
          <Folder />
          <span className={styles.header_title}>{selectedCate}</span>
        </div>
        <SquarePlus style={{color: 'var(--theme-color)'}} />
      </div>
      <div
        className={styles.articles_home}
        onClick={() => setActiveNav("home")}
      >
        <House />
        <span className={styles.home_text}>{t("home")}</span>
      </div>
      <div className={styles.articles_dir}>
        <div className={styles.dir_left}>
          <ListTree style={{marginRight: '8px'}} />
          <span className={styles.dir_text}>{t("folders")}</span>
        </div>
        <div className={styles.dir_right}>
          <Locate style={{marginRight: '6px'}} />
          {isCollapseAll ? <ArrowDownNarrowWide /> : <ArrowUpNarrowWide />}
        </div>
      </div>
      <div className={styles.articles_groups}>
        {
            
        }
      </div>
    </div>
  );
};

export default Articles;
