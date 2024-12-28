// manage article select state

import { create } from 'zustand';

export interface IArticleState {
  name: string;
  setName: (newName: string) => void;
}

export const useSelectedArticle = create<IArticleState>(set => ({
  name: '',
  setName: (newName: string) => {
    set({name: newName});
  },
}));

