import type { IArticleItem } from "./types";
import { useState, useRef, ChangeEvent } from "react";
import { Input } from "../ui/input";
import {
  Group,
  File,
  EllipsisVertical,
  Plus,
  ChevronsUpDown,
} from "lucide-react";
import getArticles from "./controllers/get-articles";
import {
  createFile,
  createGroup,
} from "./controllers/create-article";
import {
  useSelectedArticle,
  IArticleState,
} from "./controllers/selected-article";
import { useDataSource, IDataSourceState } from './controllers/datasource-state';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

interface IProps {
  parentPath: string;
  dataSource: IArticleItem[];
}

const ArticleList = function (props: IProps) {
  const { dataSource, parentPath } = props;
  const newArticleNameRef = useRef("");
  const setDataSource = useDataSource(
    (state: IDataSourceState) => state.setDataSource
  );
  const { t } = useTranslation();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    newArticleNameRef.current = event.target.value;
  }

  function handleInputBlur() {
    const newArticles = ([] as IArticleItem[]).concat(dataSource);
    const articleName = newArticleNameRef.current || t("newgroup");
    // todo: 处理 key 值推进策略以及数据更新策略
    createGroup(parentPath, articleName)
      .then(() => {
        newArticles[0] = {
          type: "group",
          name: articleName,
        };
        setDataSource(newArticles);
        // setSelectedArticle(newArticleName);
        newArticleNameRef.current = "";
      })
      .catch(() => {
        newArticles.shift();
        setDataSource(newArticles);
        newArticleNameRef.current = "";
      });
  }

  return (
    <div className={styles.article_list}>
      {dataSource.length > 0 &&
        dataSource.map((item, index) => {
          const { type, name, action, children } = item;
          const theKey = name || index;
          // todo: 处理文件 ID 生成策略
          const thePath = [parentPath, name].join('/');
          if (action) {
            return (
              <div className={styles.article_input} key={theKey}>
                <Group />
                <Input
                  className={styles.item_input}
                  onInput={handleInputChange}
                  onBlur={handleInputBlur}
                />
              </div>
            );
          }
          return type === "file" ? (
            <div className={styles.article_file} key={theKey}>
              <div className={styles.file_left}>
                <File />
                <span className={styles.file_name}>{name}</span>
              </div>
              <EllipsisVertical />
            </div>
          ) : (
            <div className={styles.article_group} key={theKey}>
              <Collapsible>
                <div className={styles.group_header}>
                  <div className={styles.group_header_label}>
                    <Group />
                    <span className={styles.file_name}>{name}</span>
                  </div>
                  <div className={styles.group_header_action}>
                    <EllipsisVertical />
                    <CollapsibleTrigger>
                      <ChevronsUpDown />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  {
                    children && children.length > 0 && (
                      <ArticleList dataSource={children} parentPath={thePath} />
                    )
                  }
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
    </div>
  );
};

export default ArticleList;
