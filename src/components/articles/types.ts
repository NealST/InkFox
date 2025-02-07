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
