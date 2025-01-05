import { create } from '@tauri-apps/plugin-fs';
import { mkdir } from '@tauri-apps/plugin-fs';
import i18n from '@/i18n';

// create a untitled file by default
export const createFile = async function(parentPath: string) {
  const file = await create(`${parentPath}/${i18n.t('untitled')}.md`);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return true;
}

export const createGroup = async function(parentPath: string, groupName: string) {
  const ret = await mkdir(`${parentPath}/${groupName}`);
  return ret;
};
