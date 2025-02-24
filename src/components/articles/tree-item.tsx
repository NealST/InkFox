import { useRef, useState, useContext, ChangeEvent } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  FilePenLine,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { GlobalDataContext } from "./controllers/global-context";
import {
  appendChild,
  renameChild,
  removeChild,
} from "./controllers/immer-articles";
import {
  useSelectedArticle,
  type IArticleState,
} from "./controllers/selected-article";
import type { IArticleItem, TreeItemProps } from "./types";
import styles from "./index.module.css";

const TreeItem = function ({
  item,
  depth = 0,
  itemPaths,
  onAddFile,
  onAddGroup,
}: TreeItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [enterItem, setEnterItem] = useState({
    name: "",
    isEntering: false,
  });
  const { dataSource, parentCatePath, setDataSource } =
    useContext(GlobalDataContext);
  const inputInfoRef = useRef({
    name: item.name,
    type: "add",
  });
  const { selectedArticle, setSelectedArticle } = useSelectedArticle(
    (state: IArticleState) => state
  );
  const { t } = useTranslation();
  const isInput = item.action === "input";
  const isDir = item.metadata.is_dir;
  const isSelected = selectedArticle.id === item.id;

  const handleClickItem = () => {
    if (isDir) {
      return;
    }
    setSelectedArticle(item);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const curValue = event.target.value;
    inputInfoRef.current.name = curValue;
  };

  const handleInputBlur = () => {
    const { name, type } = inputInfoRef.current;
    if (type === "add") {
      setDataSource(
        appendChild(
          dataSource,
          itemPaths,
          {
            ...item,
            name,
            action: "",
          },
          parentCatePath
        )
      );
      return;
    }
    setDataSource(
      renameChild(dataSource, itemPaths, {
        ...item,
        name,
        action: "",
      })
    );
    // rest input info
    inputInfoRef.current = {
      name: "",
      type: "add",
    };
  };

  const handleMouseEnter = () => {
    if (item.action === "input") {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: true,
    });
  };

  const handleMouseLeave = () => {
    if (item.action === "input") {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: false,
    });
  };

  const handleRename = () => {
    inputInfoRef.current = {
      name: item.name,
      type: "rename",
    };
    setEnterItem({
      name: "",
      isEntering: false,
    });
    setDataSource(
      renameChild(dataSource, itemPaths, {
        ...item,
        action: "input",
      })
    );
  };

  const handleDelete = () => {
    setDataSource(removeChild(dataSource, itemPaths));
  };

  const renderHoverContent = () => {
    return (
      <div className={styles.tree_item_action}>
        <div
          style={{
            color: "hsl(var(--foreground))",
            marginRight: "8px",
          }}
          title={t("rename")}
        >
          <Pencil
            style={{
              color: "hsl(var(--foreground))",
            }}
            size={14}
            onClick={handleRename}
          />
        </div>
        {isDir && (
          <HoverCard>
            <HoverCardTrigger>
              <Plus
                style={{
                  color: "hsl(var(--foreground))",
                  marginRight: "8px",
                }}
                size={14}
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-40">
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => onAddFile(itemPaths.concat(0))}
              >
                <File size={18} />
                <span className={styles.add_item_text}>{t("doc")}</span>
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => onAddGroup(itemPaths.concat(0))}
              >
                <Folder size={18} />
                <span className={styles.add_item_text}>{t("directory")}</span>
              </Button>
            </HoverCardContent>
          </HoverCard>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div title={t("remove")}>
              <Trash2
                style={{
                  color: "var(--danger)",
                }}
                size={14}
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
              <AlertDialogDescription>{t("deleteWarn")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className={styles.tree_item}>
      <div
        ref={itemRef}
        data-tree-item
        data-id={item.path}
        data-paths={itemPaths.join("-")}
        data-depth={depth}
        className={`select-none cursor-pointer px-1`}
        style={{ paddingLeft: `${depth * 22}px` }}
        onClick={handleClickItem}
      >
        <div
          className={cn(
            "flex items-center h-8 rounded",
            styles.tree_item_head,
            isSelected ? styles.tree_item_head_selected : ""
          )}
        >
          {isDir ? (
            <div
              className="flex items-center gap-2 flex-1 pl-5 group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isInput ? (
                <div className={styles.tree_item_input}>
                  <FilePenLine size={18} />
                  <Input
                    className={styles.tree_item_input_ele}
                    defaultValue={item.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </div>
              ) : (
                <div className={styles.tree_item_dir}>
                  <div className={styles.dir_left}>
                    {item.children && item.children.length > 0 ? (
                      <Collapsible>
                        <CollapsibleTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronDown size={18} />
                        </CollapsibleTrigger>
                      </Collapsible>
                    ) : (
                      <Folder size={18} />
                    )}
                    <span className={styles.dir_name}>{item.name}</span>
                  </div>
                  {enterItem.name === item.name &&
                    enterItem.isEntering &&
                    renderHoverContent()}
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-2 flex-1 pl-5 group",
                styles.tree_item_name
              )}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.tree_item_left}>
                <File size={18} />
                {isInput ? (
                  <Input
                    className={styles.tree_item_input_ele}
                    defaultValue={item.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                ) : (
                  <span className={styles.file_name}>{item.name}</span>
                )}
              </div>
              {enterItem.name === item.name &&
                enterItem.isEntering &&
                renderHoverContent()}
            </div>
          )}
        </div>
      </div>

      {isDir && (
        <Collapsible>
          {item.children?.map((child, index) => (
            <TreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              itemPaths={itemPaths.concat(index)}
              onAddFile={onAddFile}
              onAddGroup={onAddGroup}
            />
          ))}
        </Collapsible>
      )}
    </div>
  );
};

export default TreeItem;
