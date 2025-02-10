export type FileType = 'group' | 'file';

export interface IMetadata {
  is_file: boolean;
  is_dir: boolean;
  len?: number;
  created: string;
  modified?: string;
}

export interface IArticleItem {
  name: string;
  path: string;
  metadata: IMetadata;
  action?: string;
  children?: IArticleItem[];
}

export interface TreeItemProps {
  item: IArticleItem;
  depth?: number;
  itemPaths: number[];
  selectedIds: Set<string>;
  lastSelectedId: React.MutableRefObject<string | null>;
  onSelect: (ids: Set<string>) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string, isOpen: boolean) => void;
  getIcon?: (item: IArticleItem, depth: number) => React.ReactNode;
  onAction?: (action: string, item: IArticleItem) => void;
}

export interface TreeViewProps {
  data: IArticleItem[];
  title?: string;
  showExpandAll?: boolean;
  getIcon?: (item: IArticleItem, depth: number) => React.ReactNode;
  onSelectionChange?: (selectedItems: IArticleItem[]) => void;
  onAction?: (action: string, item: IArticleItem) => void;
}
