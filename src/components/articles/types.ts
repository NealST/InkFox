export type FileType = 'group' | 'file';

export interface IMetadata {
  is_file: boolean;
  is_dir: boolean;
  len?: number;
  created: string;
  modified?: string;
}

export interface IArticleItem {
  id: string;
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
  onAddFile: (paths: number[]) => void;
  onAddGroup: (paths: number[]) => void;
}

export interface TreeViewProps {
  data: IArticleItem[];
  title?: string;
  showExpandAll?: boolean;
  getIcon?: (item: IArticleItem, depth: number) => React.ReactNode;
  onSelectionChange?: (selectedItems: IArticleItem[]) => void;
  onAction?: (action: string, item: IArticleItem) => void;
}
