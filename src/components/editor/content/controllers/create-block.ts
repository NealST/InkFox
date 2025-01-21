// create a block
import type { IBlockStateItem } from "../blocks/types";
import { uid } from 'uid';
import { produce } from 'immer';

const getCreatedState = function(curState: IBlockStateItem[], newBlock: IBlockStateItem, index: number) {
  return produce(curState, (draft) => {
    draft.splice(index, 0, newBlock);
  });
};

export const createParagraph = function(curState: IBlockStateItem[], index: number, initialChildren = [] as IBlockStateItem[]) {
  const newParagraph = {
    name: 'paragraph',
    id: uid(),
    children: initialChildren,
  };
  return getCreatedState(curState, newParagraph, index);
};

export const createHeading = function(curState: IBlockStateItem[], index: number, level = 1, text = '') {
  const newHeading = {
    name: "heading",
    id: uid(),
    meta: {
      level,
    },
    text
  };
  return getCreatedState(curState, newHeading, index);
};
