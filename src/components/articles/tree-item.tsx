import { useRef, useState, useCallback, useEffect } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Folder,
  ChevronRight,
  Server,
  Database,
  Home,
  Waves,
  Wind,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash, FolderOpen, FileEdit, Share2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import cn from 'classnames';
import type { IArticleItem, TreeItemProps } from './types';
import styles from './index.module.css';

const TreeItem = function ({
  item,
  depth = 0,
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
      if (item.metadata.is_dir && isSelected) {
        onToggleExpand(item.path, !isOpen);
      }
    }

    lastSelectedId.current = item.path;
    onSelect(newSelection);
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, item);
    } else {
      console.log(`${action} on:`, item.name);
    }
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

  // Get selected count only if folder is collapsed and has selected children
  const selectedCount =
    (item.metadata.is_dir && !isOpen && getSelectedChildrenCount(item)) ||
    null;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>
          <div
            ref={itemRef}
            data-tree-item
            data-id={item.path}
            data-depth={depth}
            data-folder-closed={item.metadata.is_dir && !isOpen}
            className={`select-none cursor-pointer ${
              isSelected ? `bg-blue-100 ${selectionStyle}` : "text-foreground"
            } px-1`}
            style={{ paddingLeft: `${depth * 20}px` }}
            onClick={handleClick}
          >
            <div className={cn("flex items-center h-8 rounded", styles.tree_item_head)}>
              {item.metadata.is_dir ? (
                <div className="flex items-center gap-2 flex-1 group">
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
                  
                  <span className="flex-1">{item.name}</span>
                  {selectedCount !== null && selectedCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="mr-2 bg-blue-100 hover:bg-blue-100"
                    >
                      {selectedCount} selected
                    </Badge>
                  )}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 group-hover:opacity-100 opacity-0 items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {item.name}
                          </div>
                          <div>
                            <span className="font-medium">Items:</span>{" "}
                            {item.children?.length || 0} direct items
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ) : (
                <div className={cn("flex items-center gap-2 flex-1 pl-6 group", styles.tree_item_name)}>
                  <span className="flex-1">{item.name}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 group-hover:opacity-100 opacity-0 items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <span className="font-medium">Path:</span> {item.path}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              )}
            </div>
          </div>

          {item.metadata.is_dir && (
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
                      {item.children?.map((child) => (
                        <TreeItem
                          key={child.path}
                          item={child}
                          depth={depth + 1}
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
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {item.metadata.is_dir ? (
          <>
            <ContextMenuItem onClick={() => handleAction("open")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Open
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("share")}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("copy")}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("delete")}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem onClick={() => handleAction("open")}>
              <FileEdit className="mr-2 h-4 w-4" />
              Open
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("share")}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("copy")}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("delete")}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TreeItem;
