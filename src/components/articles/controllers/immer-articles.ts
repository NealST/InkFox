import { produce } from 'immer';
import type { IArticleItem } from '../types';

type Action = 'addChild' | 'replace' | 'remove';

const immerArticles = function(oldArticles: IArticleItem[], changeKey: string, action: Action, newArticle?: IArticleItem) {
  return produce(oldArticles, (draft) => {
    const changeKeyStrs = changeKey.split(/\.|\[/);
    let target = changeKeyStrs.reduce((accumu, cur) => {
      const isIndex = cur.indexOf(']') >= 0;
      let key = isIndex ? Number(cur.replace(']', '')) : cur;
      // @ts-ignore
      accumu = accumu[key];
      return accumu;
    }, draft);
    if (action === 'addChild') {
      // @ts-ignore
      target.children.unshift(newArticle);
    }
    if (action === 'replace') {
      // @ts-ignore
      target = newArticle;
    }
    if (action === 'remove') {
      // todo: 处理删除的情况
    }
  });
};

export default immerArticles;
