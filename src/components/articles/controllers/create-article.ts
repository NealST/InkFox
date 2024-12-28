import { create } from '@tauri-apps/plugin-fs';

const createArticle = async function(parentPath: string, articleName: string) {
  const file = await create(`${parentPath}/${articleName}.md`);
  await file.write(new TextEncoder().encode(''));
  await file.close();
  return true;
}

export default createArticle;
