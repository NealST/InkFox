// manage the dir store

import { create } from 'zustand';

export interface ICateState {
  name: string;
  setName: (newName: string) => void;
}

export const useSelectedCate = create<ICateState>(set => ({
  name: '',
  setName: (newName: string) => {
    set({ name: newName });
  },
}));
