import { invoke } from "@tauri-apps/api/core";

const getArticles = async function(catePath: string): Promise<string> {
  try {
    const result: string = await invoke("get_dir_info", {path: catePath});
    return result;
  } catch(e) {
    console.error(e);
    return '';
  }
}

export default getArticles;
