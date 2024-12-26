// manage the dir store

import { create } from 'zustand';

export interface IState {
  name: string;
  setName: (newName: string) => void;
}

export const useSelectedCate = create<IState>(set => ({
  name: '',
  setName: (newName: string) => {
    set({ name: newName });
  },
}));
