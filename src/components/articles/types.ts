export type FileType = 'group' | 'file';

export interface IArticleItem {
  type: FileType;
  name: string;
  action?: string;
  path: string;
}
