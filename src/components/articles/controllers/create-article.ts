import { create } from '@tauri-apps/plugin-fs';
import { mkdir } from '@tauri-apps/plugin-fs';

export const createArticleFile = async function(parentPath: string, articleName: string) {
  const file = await create(`${parentPath}/${articleName}.md`);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return true;
}

export const createArticleGroup = async function(parentPath: string, groupName: string) {
  const ret = await mkdir(`${parentPath}/${groupName}`);
  return ret;
};
