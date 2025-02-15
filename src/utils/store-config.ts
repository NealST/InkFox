// config store

import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore('inkfox-settings.json');

export const setConfig = async function(key: string, value: string) {
  await store.set(key, {value});
  await store.save();
};

export const getConfig = async function(key: string) {
  const value = await store.get(key);
  return value;
};
