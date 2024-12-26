import { readDir, exists } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import getNavPath from '@/utils/get-nav-path';
import { NOTES } from '@/constants';

const getArticles = async function(selectedCate: string) {
  if (!selectedCate) {
    return [];
  }
  const notesPath = await getNavPath(NOTES);
  const catePath = await path.join(notesPath, selectedCate);
  const isCateExists = await exists(catePath);
  if (!isCateExists) {
    return [];
  }
  const entries = await readDir(catePath);
  return entries;
};

export default getArticles;
