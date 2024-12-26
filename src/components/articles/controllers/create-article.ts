import { create } from '@tauri-apps/plugin-fs';
import ensureDir from '@/utils/ensure-dir';
import getNavPath from '@/utils/get-nav-path';
import { NOTES } from '@/constants';

const createArticle = async function(cateName: string, articleName: string) {
  const notesPath = await getNavPath(NOTES);
  const catePath = `${notesPath}/${cateName}`;
  await ensureDir(catePath);
  const file = await create(`${catePath}/${articleName}.md`);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return true;
}

export default createArticle;
