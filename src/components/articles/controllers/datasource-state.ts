// manage the datasource update

import { create } from 'zustand';
import type { IArticleItem } from '../types';

export interface IDataSourceState {
  dataSource: IArticleItem[];
  setDataSource: (newDataSource: IArticleItem[]) => void;
}

export const useDataSource = create<IDataSourceState>(set => ({
  dataSource: [],
  setDataSource: (newDataSource: IArticleItem[]) => {
    set({dataSource: newDataSource});
  },
}));
