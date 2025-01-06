export type FileType = 'group' | 'file';

export interface IArticleItem {
  type: FileType;
  name: string;
  id: string;
  action?: string;
  children?: IArticleItem[];
}
