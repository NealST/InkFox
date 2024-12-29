import { readDir, exists } from '@tauri-apps/plugin-fs';
import type { IArticleItem } from '../types';

const getArticleListForDir = async function(dirPath: string): Promise<IArticleItem[]> {
  const entries = await readDir(dirPath);
  if (entries.length === 0) {
    return [] as IArticleItem[];
  }
  const ret: IArticleItem[] = [];
  for(const item of entries) {
    const {isFile, name} = item;
    ret.push({
      type: isFile ? 'file' : 'group',
      name,
      path: `${dirPath}/${name}`,
    });
  }

  return ret;
}

const getArticles = async function(parentPath: string): Promise<IArticleItem[]> {
  if (!parentPath) {
    return [] as IArticleItem[];
  }
  const isParentExists = await exists(parentPath);
  if (!isParentExists) {
    return [] as IArticleItem[];
  }
  const ret = await getArticleListForDir(parentPath);
  return ret;
};

export default getArticles;
