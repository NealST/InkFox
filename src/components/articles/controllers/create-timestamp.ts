// create timestamp for file and process the foreground format

import { format } from 'date-fns';

export const createTimeStamp = function(name: string) {
  const curTime = Date.now();
  const timeStr = format(new Date(curTime), 'yyyy-MM-dd HH:mm:ss');
  return [name, timeStr].join('_');
}

export const filterTimeStamp = function(name: string) {
  return name.split('_')[0];
}
