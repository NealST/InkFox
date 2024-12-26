import getAppPath from "./get-app-path";
import ensureDir from "./ensure-dir";

const getNavPath = async function (navName: string) {
  const appPath = await getAppPath();
  const navPath = `${appPath}/${navName}`;
  await ensureDir(navPath);
  return navPath;
};

export default getNavPath;
