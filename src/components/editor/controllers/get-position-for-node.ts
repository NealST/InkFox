// calculate the position for a Node
import { isElement } from "./get-text-content";

export interface IPosition {
  blockIndex: number;
  paragraphIndex?: number;
  childIndex: number;
}

function isBlockContentDom(node: Node | null) {
  if (!node) {
    return false;
  }
  return isElement(node) && node.classList.contains("block-content");
}

function isContentDom(node: Node | null) {
  if (!node) {
    return false;
  }
  return isElement(node) && ['paragraph-content', 'list-item-content'].some(item => node.classList.contains(item));
}

export const getBlockIndexForNode = function (node: Node): number {
  let curNode = node;
  if (isBlockContentDom(curNode)) {
    return Number((curNode as HTMLElement).dataset.blockindex);
  }

  while (!isBlockContentDom(curNode) && curNode.parentNode) {
    curNode = curNode.parentNode;
  }
  return Number((curNode as HTMLElement).dataset.blockindex);
};

export const getPositionInParagraph = function (
  node: Node | null
): IPosition | undefined {
  if (!node) {
    return;
  }
  let curNode = node;
  const retPosition: IPosition = {
    blockIndex: 0,
    childIndex: 0,
  };

  const setPositionForContentDom = function (theNode: Node) {
    const nodeData = (theNode as HTMLElement).dataset;
    const paragraphIndex = nodeData.paragraphindex;
    if (paragraphIndex !== undefined) {
      retPosition.paragraphIndex = Number(paragraphIndex);
    }
    retPosition.blockIndex = Number(nodeData.blockindex);
  };

  if (isContentDom(curNode)) {
    setPositionForContentDom(curNode);
    return retPosition;
  }

  let childIndex = 0;
  while (!isContentDom(curNode.parentNode) && curNode.parentNode) {
    curNode = curNode.parentNode as Node;
  }
  let preSibling: Node | null = node;
  do {
    preSibling = preSibling.previousSibling;
    if (preSibling) {
      childIndex += 1;
    }
  } while (preSibling);
  retPosition.childIndex = childIndex;

  const paragraphContentDom = curNode.parentNode;
  setPositionForContentDom(paragraphContentDom as Node);
  return retPosition;
};
