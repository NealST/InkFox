import { createContext } from 'react';
import type { IArticleItem } from "../types";

export const GlobalDataContext = createContext({
  dataSource: [] as IArticleItem[],
  setDataSource: (newDataSource: IArticleItem[]) => {},
  parentCatePath: "",
});
