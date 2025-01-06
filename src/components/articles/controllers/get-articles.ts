import { invoke } from "@tauri-apps/api/core";
import type { IArticleItem } from '../types';

const getArticles = async function(catePath: string): Promise<IArticleItem[]> {
  const result: IArticleItem[] = await invoke("get_dir_info", {path: catePath});
  return result;
}

export default getArticles;
