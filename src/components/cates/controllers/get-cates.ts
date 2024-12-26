// get cate list in notes

import { readDir } from "@tauri-apps/plugin-fs";
import getCatesPath from "./get-cates-path";
import type { NavTypes } from '@/constants';

const getCates = async function(navType: NavTypes) {
  try {
    const notesPath = await getCatesPath(navType);
    const entries = await readDir(notesPath);
    return entries;
  } catch (e) {
    return [];
  }
};

export default getCates;
