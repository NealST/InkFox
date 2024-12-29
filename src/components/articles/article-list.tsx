import type { IArticleItem } from "./types";
import { useEffect, useState, useRef, ChangeEvent } from "react";
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
  createArticleFile,
  createArticleGroup,
} from "./controllers/create-article";
import {
  useSelectedArticle,
  IArticleState,
} from "./controllers/selected-article";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import styles from "./index.module.css";

interface IProps {
  parentPath: string;
}

const ArticleList = function (props: IProps) {
  const { parentPath } = props;
  const [dataSource, setDataSource] = useState([] as IArticleItem[]);
  const newArticleNameRef = useRef("");

  useEffect(() => {
    getArticles(parentPath).then((ret) => {
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
    createArticleGroup(parentPath, newArticleName)
      .then(() => {
        newArticles[0] = {
          type: "group",
          name: newArticleName,
          path: `${parentPath}/${newArticleName}`,
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
        dataSource.map((item) => {
          const { type, name, action, path } = item;
          if (action) {
            return (
              <div className={styles.article_item}>
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
            <div className={styles.article_file}>
              <div className={styles.file_left}>
                <File />
                <span className={styles.file_name}>{name}</span>
              </div>
              <EllipsisVertical />
            </div>
          ) : (
            <div className={styles.article_group}>
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
                  <ArticleList parentPath={path} />
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
    </div>
  );
};

export default ArticleList;
