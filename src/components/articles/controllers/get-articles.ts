import { readDir, exists } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import getNavPath from '@/utils/get-nav-path';
import type { IArticleItem } from '../types';

const getArticleListForDir = async function(dirPath: string): Promise<IArticleItem[]> {
  const entries = await readDir(dirPath);
  if (entries.length === 0) {
    return [] as IArticleItem[];
  }
  const ret: IArticleItem[] = [];
  for(const item of entries) {
    const {isFile, name} = item;
    if (!isFile) {
      const children = await getArticleListForDir(`${dirPath}/${name}`);
      ret.push({
        type: 'group',
        name,
        children,
      });
      continue;
    }
    ret.push({
      type: 'file',
      name,
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
  const entries = await readDir(parentPath);
  if (entries.length === 0) {
    return [] as IArticleItem[];
  }
  const ret: IArticleItem[] = [];
  entries.forEach(item => {
    const {isFile, name} = item;
    ret.push({
      type: isFile ? 'file' : 'group',
      name,
    });
  });
  return ret;
};

export default getArticles;
