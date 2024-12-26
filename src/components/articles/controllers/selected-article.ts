// manage article select state

import { create } from 'zustand';

export interface IArticleState {
  name: string;
  setSelectedArticle: (newName: string) => void;
}

const useSelectedArticle = create<IArticleState>(set => ({
  name: '',
  setSelectedArticle: (newName: string) => {
    set({name: newName});
  },
}));

export default useSelectedArticle;

