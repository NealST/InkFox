import { useEffect, useState } from "react";
import {
  useSelectedCate,
  type ICateState,
} from "../cates/controllers/selected-cate";
import {
  SquarePlus,
  Folder,
  House,
  ListTree,
  Locate,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  File,
  Group,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ArticleList from "./article-list";
import getNavPath from "@/utils/get-nav-path";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { IArticleItem } from "./types";
import { createFile, createGroup } from "./controllers/create-article";
import getArticles from "./controllers/get-articles";
import {
  useDataSource,
  IDataSourceState,
} from "./controllers/datasource-state";
import styles from "./index.module.css";

const Articles = function () {
  const selectedCate = useSelectedCate((state: ICateState) => state.name);
  const { dataSource, setDataSource } = useDataSource(
    (state: IDataSourceState) => state
  );
  const { t } = useTranslation();
  const [activePath, setActivePath] = useState("home");
  const [isCollapseAll, setCollapseAll] = useState(false);
  const [parentCatePath, setParentCatePath] = useState("");

  useEffect(() => {
    getNavPath("notes").then((ret) => {
      const selectedCatePath = `${ret}/${selectedCate}`;
      setParentCatePath(selectedCatePath);

      getArticles(selectedCatePath).then((articles) => {
        setDataSource(articles);
      });
    });
  }, [selectedCate]);

  function handleAddFile() {
    createFile(parentCatePath).then(() => {
      setDataSource(
        [
          {
            type: "file",
            name: t("untitled"),
          } as IArticleItem,
        ].concat(dataSource)
      );
    });
  }

  function handleAddGroup() {
    const defaultGroupName = t("newgroup");
    setDataSource(
      [
        {
          type: "group",
          name: defaultGroupName,
          action: "input",
        } as IArticleItem,
      ].concat(dataSource)
    );
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articles_header}>
        <div className={styles.header_label}>
          <Folder />
          <span className={styles.header_title}>{selectedCate}</span>
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <SquarePlus
              style={{ color: "var(--theme-color)", cursor: "pointer" }}
            />
          </HoverCardTrigger>
          <HoverCardContent className={styles.articles_add_hover}>
            <div className={styles.articles_add_item} onClick={handleAddFile}>
              <File />
              <span className={styles.add_item_text}>{t("doc")}</span>
            </div>
            <div className={styles.articles_add_item} onClick={handleAddGroup}>
              <Group />
              <span className={styles.add_item_text}>{t("group")}</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div
        className={styles.articles_home}
        onClick={() => setActivePath("home")}
      >
        <House />
        <span className={styles.home_text}>{t("home")}</span>
      </div>
      <div className={styles.articles_dir}>
        <div className={styles.dir_left}>
          <ListTree style={{ marginRight: "8px" }} />
          <span className={styles.dir_text}>{t("folders")}</span>
        </div>
        <div className={styles.dir_right}>
          <Locate style={{ marginRight: "6px" }} />
          {isCollapseAll ? <ArrowDownNarrowWide /> : <ArrowUpNarrowWide />}
        </div>
      </div>
      <ArticleList parentPath={parentCatePath} dataSource={dataSource} />
    </div>
  );
};

export default Articles;
