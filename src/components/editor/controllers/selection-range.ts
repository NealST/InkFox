// manage the state of selection range
import { getPositionInParagraph, type IPosition } from "./get-position-for-node";
import { create } from "zustand";

export interface IRange {
  startBlockIndex: number;
  endBlockIndex: number;
  startParagraphIndex?: number;
  endParagraphIndex?: number;
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
  const startNodePosition = getPositionInParagraph(anchorNode) as IPosition;
  const startBlockIndex = startNodePosition.blockIndex;
  const startChildIndex = startNodePosition.childIndex;
  const startParagraphIndex = startNodePosition.paragraphIndex;
  if (isCollapsed) {
    return {
      startBlockIndex,
      startParagraphIndex,
      startChildIndex,
      startChildOffset: anchorOffset,
      endBlockIndex: startBlockIndex,
      endParagraphIndex: startParagraphIndex,
      endChildIndex: startChildIndex,
      endChildOffset: anchorOffset,
      isCollapsed,
    };
  }
  const endNodePosition = getPositionInParagraph(focusNode) as IPosition;
  return {
    startBlockIndex,
    startParagraphIndex,
    startChildIndex,
    startChildOffset: anchorOffset,
    endBlockIndex: endNodePosition.blockIndex,
    endParagraphIndex: endNodePosition.paragraphIndex,
    endChildIndex: endNodePosition.childIndex,
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
