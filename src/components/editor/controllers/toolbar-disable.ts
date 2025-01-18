// manage the disable state for toolbar
import { create } from 'zustand';

export interface IToolbarDisable {
  disabled: boolean;
  setDisabled: (value: boolean) => void;
}

export const useToolbarDisabled = create<IToolbarDisable>((set) => ({
  disabled: false,
  setDisabled: (value: boolean) => {
    set({disabled: value});
  }
}));
