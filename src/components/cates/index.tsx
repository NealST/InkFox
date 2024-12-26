import { useEffect, useState, useRef } from "react";
import type { ICateItem } from "./types";
import getCates from "./controllers/get-cates";
import createCate from "./controllers/create-cate";
import { useSelectedCate, type IState } from "./controllers/selected-cate";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import styles from "./index.module.css";

const Cates = function () {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([] as ICateItem[]);
  const { name: selectedCate, setName: setSelectedCate } = useSelectedCate(
    (state: IState) => state
  );
  const newCateNameRef = useRef("");

  useEffect(() => {
    getCates("notes").then((ret) => {
      console.log("cates ret", ret);
      if (ret.length === 0) {
        return;
      }
      setDataSource(
        ret
          .filter((item) => item.isDirectory)
          .map((item) => ({
            name: item.name,
            type: "cate",
          }))
      );
      setSelectedCate(ret[0].name);
    });
  }, []);

  function handleAddCate() {
    const newDataSource = [
      {
        type: "input",
        name: "",
      },
    ].concat(dataSource);
    setDataSource(newDataSource);
  }

  return (
    <div className={styles.cates}>
      <div className={styles.cates_header}>
        <span className={styles.header_label}>{t("folders")}</span>
        <Icon
          icon="mdi-light:folder-plus"
          style={{ fontSize: "var(--icon-size)", color: "var(--font-color)" }}
          onClick={handleAddCate}
        />
      </div>
    </div>
  );
};

export default Cates;
