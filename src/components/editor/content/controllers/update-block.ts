import type { IBlockStateItem } from "../blocks/types";
import { produce } from "immer";

const getUpdatedState = function (
  curState: IBlockStateItem[],
  newBlock: IBlockStateItem,
  index: number
) {
  return produce(curState, (draft) => {
    draft[index] = {
      ...curState[index],
      ...newBlock,
    };
  });
};

export default getUpdatedState;
