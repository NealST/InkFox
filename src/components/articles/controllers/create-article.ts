import { create } from '@tauri-apps/plugin-fs';
import { mkdir } from '@tauri-apps/plugin-fs';
import i18n from '@/i18n';

// create a untitled file by default
export const createFile = async function(parentPath: string) {
  const filePath = `${parentPath}/${i18n.t('untitled')}.json`;
  const file = await create(filePath);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return filePath;
}

export const createGroup = async function(parentPath: string, groupName: string) {
  const ret = await mkdir(`${parentPath}/${groupName}`);
  return ret;
};
