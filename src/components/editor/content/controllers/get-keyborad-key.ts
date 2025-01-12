import { KeyboardEvent } from 'react';
// get keyboard event press key
const getKeyboardKey = function (event: KeyboardEvent<Element>) {
  // @ts-ignore
  const { key, code, keyIdentifier } = event;
  return keyIdentifier || code || key;
};

export default getKeyboardKey;
