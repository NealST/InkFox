import { useEffect, useState, useRef, useMemo, MouseEvent } from "react";
import {
  useSelectedCate,
  type ICateState,
} from "../cates/controllers/selected-cate";
import {
  ListTree,
  Locate,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  File,
  Folder,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import getNavPath from "@/utils/get-nav-path";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { IArticleItem } from "./types";
import getArticles from "./controllers/get-articles";
import {
  useDataSource,
  IDataSourceState,
} from "./controllers/datasource-state";
import { appendChild } from "./controllers/immer-articles";
import { GlobalDataContext } from "./controllers/global-context";
import { format } from "date-fns";
import TreeItem from "./tree-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uid } from "uid";
import styles from "./index.module.css";

const Articles = function () {
  const selectedCate = useSelectedCate((state: ICateState) => state.name);
  const { dataSource, setDataSource } = useDataSource(
    (state: IDataSourceState) => state
  );
  const { t } = useTranslation();
  const [isCollapseAll, setCollapseAll] = useState(false);
  const [parentCatePath, setParentCatePath] = useState("");
  const curSelectedItemPathsRef = useRef([] as number[]);

  const globalData = useMemo(
    () => ({
      dataSource,
      parentCatePath,
      setDataSource,
    }),
    [dataSource, parentCatePath]
  );

  useEffect(() => {
    getNavPath("notes").then((ret) => {
      const selectedCatePath = `${ret}/${selectedCate}`;
      if (selectedCate) {
        setParentCatePath(selectedCatePath);

        getArticles(selectedCatePath).then((retStr) => {
          const searchResult = JSON.parse(retStr);
          console.log("searchResult", searchResult);
          // setDataSource(articles);
          setDataSource(searchResult.children || []);
        });
      }
    });
  }, [selectedCate]);

  function handleAddFile(itemPaths?: number[]) {
    const usedItemPaths = itemPaths || curSelectedItemPathsRef.current;

    setDataSource(
      appendChild(
        dataSource,
        usedItemPaths,
        {
          id: uid(),
          name: "",
          action: "input",
          path: "",
          metadata: {
            is_dir: false,
            is_file: true,
            len: 0,
            created: format(Date.now(), "yyyy-MM-dd HH:mm:ss"),
          },
        },
        parentCatePath
      )
    );
  }

  function handleAddGroup(itemPaths?: number[]) {
    const usedItemPaths = itemPaths || curSelectedItemPathsRef.current;
    setDataSource(
      appendChild(
        dataSource,
        usedItemPaths,
        {
          id: uid(),
          name: "",
          action: "input",
          path: "",
          children: [] as IArticleItem[],
          metadata: {
            is_dir: true,
            is_file: false,
            created: format(Date.now(), "yyyy-MM-dd HH:mm:ss"),
          },
        },
        parentCatePath
      )
    );
  }

  function handleSelect(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const paths = target?.dataset?.paths;
    if (!paths) {
      return;
    }
    curSelectedItemPathsRef.current = paths
      .split("-")
      .map((item) => Number(item));
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articles_header}>
        <Input placeholder={t("search")} className={styles.articles_search} />
        <HoverCard>
          <HoverCardTrigger>
            <Button className={styles.header_add}>+</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-40">
            {selectedCate ? (
              <>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => handleAddFile()}
                >
                  <File size={18} />
                  <span className={styles.add_item_text}>{t("doc")}</span>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => handleAddGroup()}
                >
                  <Folder size={18} />
                  <span className={styles.add_item_text}>{t("directory")}</span>
                </Button>
              </>
            ) : (
              <div className={styles.add_empty}>
                {t("emptySelectedCategory")}
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className={styles.articles_dir}>
        <div className={styles.dir_left}>
          <ListTree style={{ marginRight: "8px" }} size={18} />
          <span className={styles.dir_text}>{t("folders")}</span>
        </div>
        <div className={styles.dir_right}>
          <Locate style={{ marginRight: "6px" }} size={20} />
          {isCollapseAll ? (
            <ArrowDownNarrowWide size={20} />
          ) : (
            <ArrowUpNarrowWide size={20} />
          )}
        </div>
      </div>

      {dataSource.length > 0 ? (
        <GlobalDataContext.Provider value={globalData}>
          <div className={styles.articles_tree} onClick={handleSelect}>
            {dataSource.map((item, index) => (
              <TreeItem
                key={item.id}
                item={item}
                itemPaths={[index]}
                onAddFile={handleAddFile}
                onAddGroup={handleAddGroup}
              />
            ))}
          </div>
        </GlobalDataContext.Provider>
      ) : (
        <div className={styles.empty}>
          {t(selectedCate ? "emptyFolders" : "emptySelectedCategory")}
        </div>
      )}
    </div>
  );
};

export default Articles;
