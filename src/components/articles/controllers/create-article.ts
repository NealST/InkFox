import { create } from '@tauri-apps/plugin-fs';
import ensureDir from '@/utils/ensure-dir';
import getNavPath from '@/utils/get-nav-path';

const createArticle = async function(cateName: string, articleName: string, groupName?: string) {
  const notesPath = await getNavPath('notes');
  const catePath = `${notesPath}/${cateName}`;
  await ensureDir(catePath);
  const dirPath = groupName ? `${catePath}/${groupName}` : catePath;
  await ensureDir(dirPath);
  const file = await create(`${dirPath}/${articleName}.md`);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return true;
}

export default createArticle;
