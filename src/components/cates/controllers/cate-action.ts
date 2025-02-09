import { mkdir, rename, remove } from '@tauri-apps/plugin-fs';
import getNavPath from '@/utils/get-nav-path';

export const createCate = async function(name: string) {
  const notesPath = await getNavPath('notes');
  const ret = await mkdir(`${notesPath}/${name}`);
  return ret;
}

export const renameCate = async function(oldName: string, newName: string) {
  const notesPath = await getNavPath('notes');
  const oldPath = `${notesPath}/${oldName}`;
  const newPath = `${notesPath}/${newName}`;
  await rename(oldPath, newPath);
}

export const deleteCate = async function(name: string) {
  const notesPath = await getNavPath('notes');
  await remove(`${notesPath}/${name}`, {
    recursive: true
  });
}
