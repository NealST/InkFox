import { useRef, useState, useCallback, useEffect, ChangeEvent } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Folder,
  File,
  ChevronRight,
  FilePenLine,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import cn from "classnames";
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
  const inputInfoRef = useRef({
    name: '',
    type: 'add',
  });
  const isInput = item.action === "input";
  const isDir = item.metadata.is_dir;

  // Get all visible items in order
  const getVisibleItems = useCallback(
    (items: IArticleItem[]): IArticleItem[] => {
      let visibleItems: IArticleItem[] = [];

      items.forEach((item) => {
        visibleItems.push(item);
        if (
          item.metadata.is_dir &&
          expandedIds.has(item.path) &&
          item.children
        ) {
          visibleItems = [...visibleItems, ...getVisibleItems(item.children)];
        }
      });

      return visibleItems;
    },
    [expandedIds]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let newSelection = new Set(selectedIds);

    if (!itemRef.current) return;

    if (e.shiftKey && lastSelectedId.current !== null) {
      const items = Array.from(
        document.querySelectorAll("[data-tree-item]")
      ) as HTMLElement[];
      const lastIndex = items.findIndex(
        (el) => el.getAttribute("data-id") === lastSelectedId.current
      );
      const currentIndex = items.findIndex((el) => el === itemRef.current);
      const [start, end] = [
        Math.min(lastIndex, currentIndex),
        Math.max(lastIndex, currentIndex),
      ];

      items.slice(start, end + 1).forEach((el) => {
        const id = el.getAttribute("data-id");
        const parentFolderClosed = el.closest('[data-folder-closed="true"]');
        const isClosedFolder = el.getAttribute("data-folder-closed") === "true";

        if (id && (isClosedFolder || !parentFolderClosed)) {
          newSelection.add(id);
        }
      });
    } else if (e.ctrlKey || e.metaKey) {
      if (newSelection.has(item.path)) {
        newSelection.delete(item.path);
      } else {
        newSelection.add(item.path);
      }
    } else {
      newSelection = new Set([item.path]);
      // Open folder on single click if it's a folder
      if (isDir && isSelected) {
        onToggleExpand(item.path, !isOpen);
      }
    }

    lastSelectedId.current = item.path;
    onSelect(newSelection);
  };

  // Add function to count selected items in a folder
  const getSelectedChildrenCount = (item: IArticleItem): number => {
    let count = 0;

    if (!item.children) return 0;

    item.children.forEach((child) => {
      if (selectedIds.has(child.path)) {
        count++;
      }
      if (child.metadata.is_dir) {
        count += getSelectedChildrenCount(child);
      }
    });

    return count;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const curValue = event.target.value;
    inputInfoRef.current.name = curValue;
  };

  const handleInputBlur = () => {};

  return (
    <div className={styles.tree_item}>
      <div
        ref={itemRef}
        data-tree-item
        data-id={item.path}
        data-depth={depth}
        data-folder-closed={isDir && !isOpen}
        className={`select-none cursor-pointer ${
          isSelected ? `bg-blue-100 ${selectionStyle}` : "text-foreground"
        } px-1`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={handleClick}
      >
        <div
          className={cn("flex items-center h-8 rounded", styles.tree_item_head)}
        >
          {isDir ? (
            <div className="flex items-center gap-2 flex-1 group">
              {isInput ? (
                <div className={styles.tree_item_input}>
                  <FilePenLine />
                  <Input
                    className={styles.tree_item_input_ele}
                    defaultValue={item.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </div>
              ) : (
                <>
                  {item.children && item.children.length > 0 ? (
                    <Collapsible
                      open={isOpen}
                      onOpenChange={(open) => onToggleExpand(item.path, open)}
                    >
                      <CollapsibleTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-6 w-6">
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
                    <Folder />
                  )}
                  <span className="flex-1">{item.name}</span>
                </>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-2 flex-1 pl-6 group",
                styles.tree_item_name
              )}
            >
              <File size={18} />
              <span className="flex-1">{item.name}</span>
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
