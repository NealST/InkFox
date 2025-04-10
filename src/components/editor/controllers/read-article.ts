// 读取文件内容

import { readTextFile } from '@tauri-apps/plugin-fs';

const readArticle = async function(filePath: string) {
  let result = '[]';
  try {
    result = await readTextFile(filePath);
  } catch(e) {
    console.log('read error', e);
  }
  return result;
};

export default readArticle;
