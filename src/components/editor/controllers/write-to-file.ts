// write json to file

import { writeTextFile } from '@tauri-apps/plugin-fs';

const writeToFile = async function(content: Object, filePath: string) {
  const contentStr = JSON.stringify(content);
  await writeTextFile(filePath, contentStr)
};

export default writeToFile;
