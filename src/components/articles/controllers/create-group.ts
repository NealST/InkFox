import { mkdir } from '@tauri-apps/plugin-fs';

const createGroup = async function(parentPath: string, groupName: string) {
  const ret = await mkdir(`${parentPath}/${groupName}`);
  return ret;
};

export default createGroup;
