import { mkdir } from '@tauri-apps/plugin-fs';
import getNavPath from '@/utils/get-nav-path';

const createCate = async function(name: string) {
  const notesPath = await getNavPath('notes');
  const ret = await mkdir(`${notesPath}/${name}`);
  return ret;
}

export default createCate;
