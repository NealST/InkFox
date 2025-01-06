import type { IArticleItem } from "./types";
import { useRef, ChangeEvent } from "react";
import { Input } from "../ui/input";
import {
  Group,
  File,
  EllipsisVertical,
  Plus,
  ChevronsUpDown,
} from "lucide-react";
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
import { uid } from 'uid';
import immerArticles from "./controllers/immer-articles";
import styles from "./index.module.css";

interface IProps {
  parentPath: string;
  parentKey: string;
  dataSource: IArticleItem[];
}

const ArticleList = function (props: IProps) {
  const { dataSource, parentPath, parentKey } = props;
  const newArticleNameRef = useRef("");
  const { dataSource: globalDataSource, setDataSource } = useDataSource(
    (state: IDataSourceState) => state
  );
  const { t } = useTranslation();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    newArticleNameRef.current = event.target.value;
  }

  function handleInputBlur() {
    const articleName = newArticleNameRef.current || t("newgroup");
    createGroup(parentPath, articleName)
      .then(() => {
        const newArticles = immerArticles(globalDataSource, `${parentKey}[0]`, 'replace', {
          type: "group",
          name: articleName,
          id: uid(),
        });
        setDataSource(newArticles);
        // setSelectedArticle(newArticleName);
        newArticleNameRef.current = "";
      })
  }

  return (
    <div className={styles.article_list}>
      {dataSource.length > 0 &&
        dataSource.map((item, index) => {
          const { type, name, action, id, children } = item;
          const thePath = [parentPath, name].join('/');
          const theKey = `${parentKey}[${index}]`;
          if (action) {
            return (
              <div className={styles.article_input} key={id}>
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
            <div className={styles.article_file} key={id}>
              <div className={styles.file_left}>
                <File />
                <span className={styles.file_name}>{name}</span>
              </div>
              <EllipsisVertical />
            </div>
          ) : (
            <div className={styles.article_group} key={id}>
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
                      <ArticleList dataSource={children} parentPath={thePath} parentKey={`${theKey}.children`} />
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
