// manage article select state

import { create } from 'zustand';
import type { IArticleItem } from '../types';

export interface IArticleState {
  selectedArticle: IArticleItem;
  setSelectedArticle: (newArticle: IArticleItem) => void;
}

export const useSelectedArticle = create<IArticleState>(set => ({
  selectedArticle: {} as IArticleItem,
  setSelectedArticle: (newArticle: IArticleItem) => {
    set({selectedArticle: newArticle});
  },
}));
