import { useRef, useState, useContext, ChangeEvent } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
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
  FilePenLine,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { GlobalDataContext } from "./controllers/global-context";
import {
  appendChild,
  renameChild,
  removeChild,
} from "./controllers/immer-articles";
import type { IArticleItem, TreeItemProps } from "./types";
import styles from "./index.module.css";

const TreeItem = function ({
  item,
  depth = 0,
  itemPaths,
  selectedIds,
  lastSelectedId,
  onSelect,
  expandedIds,
  onToggleExpand,
  getIcon,
  onAction,
}: TreeItemProps) {
  const isOpen = expandedIds.has(item.path);
  const isSelected = selectedIds.has(item.path);
  const itemRef = useRef<HTMLDivElement>(null);
  const [selectionStyle, setSelectionStyle] = useState("");
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
  const { t } = useTranslation();
  const isInput = item.action === "input";
  const isDir = item.metadata.is_dir;

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
      name: '',
      type: "add",
    };
  };

  const handleMouseEnter = () => {
    if (item.action === 'input') {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: true
    });
  };

  const handleMouseLeave = () => {
    if (item.action === 'input') {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: false
    });
  };

  const handleRename = () => {
    inputInfoRef.current = {
      name: item.name,
      type: "rename",
    };
    setEnterItem({
      name: '',
      isEntering: false,
    });
    setDataSource(renameChild(dataSource, itemPaths, {
      ...item,
      action: 'input',
    }));
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
            marginRight: "6px",
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
        data-folder-closed={isDir && !isOpen}
        className={`select-none cursor-pointer ${
          isSelected ? `bg-blue-100 ${selectionStyle}` : "text-foreground"
        } px-1`}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <div
          className={cn("flex items-center h-8 rounded", styles.tree_item_head)}
        >
          {isDir ? (
            <div
              className="flex items-center gap-2 flex-1 pl-6 group"
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
                      <Collapsible
                        open={isOpen}
                        onOpenChange={(open) => onToggleExpand(item.path, open)}
                      >
                        <CollapsibleTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <motion.div
                              initial={false}
                              animate={{ rotate: isOpen ? 90 : 0 }}
                              transition={{ duration: 0.1 }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </Button>
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
                "flex items-center gap-2 flex-1 pl-6 group",
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
        <Collapsible
          open={isOpen}
          onOpenChange={(open) => onToggleExpand(item.path, open)}
        >
          <AnimatePresence initial={false}>
            {isOpen && (
              <CollapsibleContent forceMount asChild>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.05 }}
                >
                  {item.children?.map((child, index) => (
                    <TreeItem
                      key={child.path}
                      item={child}
                      depth={depth + 1}
                      itemPaths={itemPaths.concat(index)}
                      selectedIds={selectedIds}
                      lastSelectedId={lastSelectedId}
                      onSelect={onSelect}
                      expandedIds={expandedIds}
                      onToggleExpand={onToggleExpand}
                      getIcon={getIcon}
                      onAction={onAction}
                    />
                  ))}
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Collapsible>
      )}
    </div>
  );
};

export default TreeItem;
