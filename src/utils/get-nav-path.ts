import getAppPath from "./get-app-path";
import ensureDir from "./ensure-dir";
import { NavTypes } from '@/constants';

const getNavPath = async function (navName: NavTypes) {
  const appPath = await getAppPath();
  const navPath = `${appPath}/${navName}`;
  await ensureDir(navPath);
  return navPath;
};

export default getNavPath;
