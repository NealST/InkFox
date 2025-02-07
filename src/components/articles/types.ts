export type FileType = 'group' | 'file';

export interface IMetadata {
  is_file: boolean;
  is_dir: boolean;
  len: number;
}

export interface IArticleItem {
  name: string;
  path: string;
  metadata: IMetadata;
  action?: string;
  children?: IArticleItem[];
}

export interface TreeViewItem {
  id: string;
  name: string;
  type: string;
  children?: TreeViewItem[];
}

export interface TreeItemProps {
  item: TreeViewItem;
  depth?: number;
  selectedIds: Set<string>;
  lastSelectedId: React.MutableRefObject<string | null>;
  onSelect: (ids: Set<string>) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string, isOpen: boolean) => void;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  onAction?: (action: string, item: TreeViewItem) => void;
}
