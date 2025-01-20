// manage the state of selection range
import getBlockIndex from "./get-block-index";
import getChildIndex from "./get-child-index";
import { create } from "zustand";

export interface IRange {
  startBlockIndex: number;
  endBlockIndex: number;
  startChildIndex: number;
  endChildIndex: number;
  startChildOffset: number;
  endChildOffset: number;
  isCollapsed: boolean;
}

export interface ISelectionRange {
  range: IRange;
  setRange: (newRange: IRange) => void;
}

const defaultRange = {
  startBlockIndex: 0,
  endBlockIndex: 0,
  startChildIndex: 0,
  endChildIndex: 0,
  startChildOffset: 0,
  endChildOffset: 0,
  isCollapsed: true,
};

export const getSelectionRange = function (): IRange {
  const { anchorNode, anchorOffset, focusNode, focusOffset, isCollapsed } =
    document.getSelection() as Selection;
  if (!anchorNode) {
    return defaultRange;
  }
  const startBlockIndex = getBlockIndex(anchorNode);
  const startContentDom = document.querySelector(
    `.block-content-${startBlockIndex}`
  );
  const startChildIndex = getChildIndex(
    anchorNode,
    startContentDom as HTMLElement
  );
  if (isCollapsed) {
    return {
      startBlockIndex,
      startChildIndex,
      startChildOffset: anchorOffset,
      endBlockIndex: startBlockIndex,
      endChildIndex: startChildIndex,
      endChildOffset: anchorOffset,
      isCollapsed,
    };
  }
  const endBlockIndex = getBlockIndex(focusNode as Node);
  const endChildIndex = getChildIndex(
    focusNode as Node,
    document.querySelector(`.block-content-${endBlockIndex}`) as HTMLElement
  );
  return {
    startBlockIndex,
    startChildIndex,
    startChildOffset: anchorOffset,
    endBlockIndex: endBlockIndex,
    endChildIndex: endChildIndex,
    endChildOffset: focusOffset,
    isCollapsed,
  };
};

export const useSelectionRange = create<ISelectionRange>((set) => ({
  range: getSelectionRange(),
  setRange: (newRange: IRange) => {
    set({ range: newRange });
  },
}));
