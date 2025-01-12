import { create } from "zustand";
import { uid } from 'uid';
import type { IBlockStateItem } from "../blocks/types";
import { defaultState } from '../mock/data';

export interface IContentState {
  dataSource: IBlockStateItem[];
  setDataSource: (newDataSource: IBlockStateItem[]) => void;
}

export const useContentState = create<IContentState>((set) => ({
  dataSource: defaultState.map(item => ({
    ...item,
    id: uid(),
  })),
  setDataSource: (newDataSource: IBlockStateItem[]) => {
    set({ dataSource: newDataSource });
  },
}));
