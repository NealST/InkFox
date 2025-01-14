import { create } from "zustand";
import { uid } from "uid";
import type { IBlockStateItem } from "../blocks/types";
import { defaultState } from "../mock/data";

const initState = defaultState.map((item) => ({
  ...item,
  id: uid(),
}));
const STATE_COUNT = 20;
const undoArr: IBlockStateItem[][] = [initState];
const redoArr: IBlockStateItem[][] = [];

export interface IContentState {
  dataSource: IBlockStateItem[];
  undoArr: IBlockStateItem[][];
  redoArr: IBlockStateItem[][];
  setDataSource: (
    newDataSource: IBlockStateItem[],
    isUndo?: boolean,
    isRedo?: boolean
  ) => void;
}

export const useContentState = create<IContentState>((set) => {
  const contentState = {
    dataSource: initState,
    undoArr,
    redoArr,
    setDataSource: (
      newDataSource: IBlockStateItem[],
      isUndo = false,
      isRedo = false
    ) => {
      if (!isUndo && !isRedo) {
        undoArr.push(newDataSource);
        // control the total state count in case that memory is oversized
        if (undoArr.length + redoArr.length > STATE_COUNT) {
          undoArr.shift();
        }
        set({ dataSource: newDataSource, undoArr, redoArr });
        return;
      }
      if (isUndo) {
        redoArr.push(undoArr.pop() || []);
        set({ dataSource: undoArr[undoArr.length - 1], undoArr, redoArr });
        return;
      }
      if (isRedo) {
        undoArr.push(redoArr.pop() || []);
        set({ dataSource: undoArr[undoArr.length - 1], undoArr, redoArr });
        return;
      }
    },
  };
  return contentState;
});
