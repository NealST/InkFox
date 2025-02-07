"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import TreeItem from "./tree-item";
import { TreeViewItem } from './types';
import { test_data } from "@/lib/demo_data";

export interface TreeViewProps {
  data: TreeViewItem[];
  title?: string;
  showExpandAll?: boolean;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  onSelectionChange?: (selectedItems: TreeViewItem[]) => void;
  onAction?: (action: string, item: TreeViewItem) => void;
}

export default function TreeView({
  data,
  title = "Tree View",
  showExpandAll = true,
  getIcon,
  onSelectionChange,
  onAction,
}: TreeViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const lastSelectedId = useRef<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const DRAG_THRESHOLD = 10; // pixels
  const [currentMousePos, setCurrentMousePos] = useState<number>(0);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInside =
        (treeRef.current && treeRef.current.contains(target)) ||
        (dragRef.current && dragRef.current.contains(target));

      if (!clickedInside) {
        setSelectedIds(new Set());
        lastSelectedId.current = null;
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  // Calculate selected items count
  const getSelectionCounts = () => {
    const counts = { files: 0, folders: 0 };

    const countItem = (item: TreeViewItem) => {
      if (selectedIds.has(item.id)) {
        if (item.type === "folder") {
          counts.folders++;
        } else {
          counts.files++;
        }
      }

      if (item.children) {
        item.children.forEach(countItem);
      }
    };

    data.forEach(countItem);
    return counts;
  };

  const { files, folders } = getSelectionCounts();

  // Function to collect all folder IDs
  const getAllFolderIds = (items: TreeViewItem[]): string[] => {
    let ids: string[] = [];
    items.forEach((item) => {
      if (item.type === "folder") {
        ids.push(item.id);
        if (item.children) {
          ids = [...ids, ...getAllFolderIds(item.children)];
        }
      }
    });
    return ids;
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(getAllFolderIds(data)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleToggleExpand = (id: string, isOpen: boolean) => {
    const newExpandedIds = new Set(expandedIds);
    if (isOpen) {
      newExpandedIds.add(id);
    } else {
      newExpandedIds.delete(id);
    }
    setExpandedIds(newExpandedIds);
  };

  const getSelectedItems = useCallback((): TreeViewItem[] => {
    const selectedItems: TreeViewItem[] = [];

    const findSelectedItems = (items: TreeViewItem[]) => {
      items.forEach((item) => {
        if (selectedIds.has(item.id)) {
          // Create a new object without children
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, ...itemWithoutChildren } = item;
          selectedItems.push(itemWithoutChildren);
        }
        if (item.children) {
          findSelectedItems(item.children);
        }
      });
    };

    findSelectedItems(data);
    return selectedItems;
  }, [data, selectedIds]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only track on left click and not on buttons
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;

    setDragStartPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Check if primary button is still held down
      if (!(e.buttons & 1)) {
        setIsDragging(false);
        setDragStart(null);
        setDragStartPosition(null);
        return;
      }

      // If we haven't registered a potential drag start position, ignore
      if (!dragStartPosition) return;

      // Calculate distance moved
      const deltaX = e.clientX - dragStartPosition.x;
      const deltaY = e.clientY - dragStartPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If we haven't started dragging yet, check if we should start
      if (!isDragging) {
        if (distance > DRAG_THRESHOLD) {
          setIsDragging(true);
          setDragStart(dragStartPosition.y);

          // Clear selection if not holding shift/ctrl
          if (!e.shiftKey && !e.ctrlKey) {
            setSelectedIds(new Set());
            lastSelectedId.current = null;
          }
        }
        return;
      }

      // Rest of the existing drag logic
      if (!dragRef.current) return;

      const items = Array.from(
        dragRef.current.querySelectorAll("[data-tree-item]")
      ) as HTMLElement[];

      const startY = dragStart;
      const currentY = e.clientY;
      const [selectionStart, selectionEnd] = [
        Math.min(startY || 0, currentY),
        Math.max(startY || 0, currentY),
      ];

      const newSelection = new Set(
        e.shiftKey || e.ctrlKey ? Array.from(selectedIds) : []
      );

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top;
        const itemBottom = rect.top + rect.height;

        if (itemBottom >= selectionStart && itemTop <= selectionEnd) {
          const id = item.getAttribute("data-id");
          const isClosedFolder =
            item.getAttribute("data-folder-closed") === "true";
          const parentFolderClosed = item.closest(
            '[data-folder-closed="true"]'
          );

          if (id && (isClosedFolder || !parentFolderClosed)) {
            newSelection.add(id);
          }
        }
      });

      setSelectedIds(newSelection);
      setCurrentMousePos(e.clientY);
    },
    [isDragging, dragStart, selectedIds, dragStartPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragStartPosition(null);
  }, []);

  // Add cleanup for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  // Call onSelectionChange when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedItems());
    }
  }, [selectedIds, onSelectionChange, getSelectedItems]);

  return (
    <div className="flex gap-4">
      <div
        ref={treeRef}
        className="bg-background p-6 rounded-xl border max-w-2xl space-y-4 w-[600px]"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            {showExpandAll && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleExpandAll}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleCollapseAll}
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Collapse All
                </Button>
              </div>
            )}
          </div>
          {(files > 0 || folders > 0) && (
            <div className="text-sm text-muted-foreground space-x-2">
              {folders > 0 && (
                <span>
                  {folders} folder{folders !== 1 ? "s" : ""}
                </span>
              )}
              {files > 0 && folders > 0 && <span>·</span>}
              {files > 0 && (
                <span>
                  {files} file{files !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          ref={dragRef}
          className="border rounded-lg p-4 bg-card relative select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {isDragging && (
            <div
              className="absolute inset-0 bg-blue-500/0 pointer-events-none"
              style={{
                top: Math.min(
                  dragStart || 0,
                  dragStart === null ? 0 : currentMousePos
                ),
                height: Math.abs(
                  (dragStart || 0) - (dragStart === null ? 0 : currentMousePos)
                ),
              }}
            />
          )}
          {data.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              selectedIds={selectedIds}
              lastSelectedId={lastSelectedId}
              onSelect={setSelectedIds}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              getIcon={getIcon}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}