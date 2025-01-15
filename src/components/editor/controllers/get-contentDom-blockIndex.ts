// get the block index for the content dom 

import { isElement } from './get-text-content';

function isBlockContentDom(node: Node) {
  return isElement(node) && node.classList.contains('block-content');
}

const getBlockIndexForContentDom = function(node: Node):number {
  let curNode = node;
  if (isBlockContentDom(curNode)) {
    return Number((curNode as HTMLElement).dataset.blockindex);
  }

  while(!isBlockContentDom(curNode) && curNode.parentNode) {
    curNode = curNode.parentNode;
  }
  return Number((curNode as HTMLElement).dataset.blockindex);
}

export default getBlockIndexForContentDom;
