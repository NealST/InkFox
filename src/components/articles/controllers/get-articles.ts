import { invoke } from "@tauri-apps/api/core";
import type { IArticleItem } from '../types';

const getArticles = async function(catePath: string): Promise<IArticleItem[]> {
  try {
    const result: IArticleItem[] = await invoke("get_dir_info", {path: catePath});
    return result;
  } catch(e) {
    console.error(e);
  }
  
}

export default getArticles;
