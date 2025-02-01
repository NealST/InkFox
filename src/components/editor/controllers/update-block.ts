import type { IBlockStateItem } from "../content/blocks/types";
import { produce } from "immer";

const getUpdatedState = function (
  curState: IBlockStateItem[],
  newBlock: IBlockStateItem,
  blockIndex: number
) {
  return produce(curState, (draft) => {
    draft[blockIndex] = {
      ...draft[blockIndex],
      ...newBlock,
    };
  });
};

export default getUpdatedState;
