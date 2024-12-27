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

const getArticles = async function(selectedCate: string): Promise<IArticleItem[]> {
  if (!selectedCate) {
    return [] as IArticleItem[];
  }
  const notesPath = await getNavPath('notes');
  const catePath = await path.join(notesPath, selectedCate);
  const isCateExists = await exists(catePath);
  if (!isCateExists) {
    return [] as IArticleItem[];
  }
  const ret = await getArticleListForDir(catePath);
  return ret;
};

export default getArticles;
