import getAppPath from "@/utils/get-app-path";
import ensureDir from "@/utils/ensure-dir";

const getCatesPath = async function (cateName: string) {
  const appPath = await getAppPath();
  const catesPath = `${appPath}/${cateName}`;
  await ensureDir(catesPath);
  return catesPath;
};

export default getCatesPath;
