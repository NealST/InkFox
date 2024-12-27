import { useEffect, useState, useRef, ChangeEvent } from "react";
import type { ICateItem } from "./types";
import getCates from "./controllers/get-cates";
import createCate from "./controllers/create-cate";
import { useSelectedCate, type ICateState } from "./controllers/selected-cate";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import cn from "classnames";
import styles from "./index.module.css";

const Cates = function () {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([] as ICateItem[]);
  const { name: selectedCate, setName: setSelectedCate } = useSelectedCate(
    (state: ICateState) => state
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
    setSelectedCate("");
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    newCateNameRef.current = event.target?.value;
  }

  function handleBlur() {
    const newCates = ([] as ICateItem[]).concat(dataSource);
    const newCateName = newCateNameRef.current;
    if (!newCateName) {
      newCates.shift();
      setDataSource(newCates);
      setSelectedCate(newCates[0]?.name || "");
      return;
    }
    createCate(newCateName)
      .then(() => {
        newCates[0] = {
          type: "cate",
          name: newCateName,
        };
        setDataSource(newCates);
        setSelectedCate(newCateName);
      })
      .catch(() => {
        newCates.shift();
        setDataSource(newCates);
        setSelectedCate(newCates[0]?.name || "");
      });
  }

  return (
    <div className={styles.cates}>
      <div className={styles.cates_header}>
        <div className={styles.header_label}>
          <Icon
            icon="fluent:caret-down-16-filled"
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          />
          <span className={styles.label_text}>{t("cates")}</span>
        </div>
        <Icon
          icon="f7:plus-app-fill"
          width="24"
          height="24"
          style={{ color: "var(--theme-color)" }}
          onClick={handleAddCate}
        />
      </div>
      <div className={styles.cates_list}>
        {dataSource.length > 0 &&
          dataSource.map((item) => {
            const { name, type } = item;
            const isSelected = name === selectedCate;
            return (
              <div
                className={cn(
                  styles.cate_item,
                  isSelected ? styles.cate_item_selected : ""
                )}
                onClick={() => setSelectedCate(name)}
              >
                <Icon
                  icon="mdi-light:folder"
                  style={{
                    fontSize: "16px",
                    color: "var(--font-color)",
                    marginRight: "6px",
                  }}
                />
                {type === "input" ? (
                  <input
                    className={styles.item_input}
                    type="text"
                    onChange={handleInput}
                    onBlur={handleBlur}
                  />
                ) : (
                  <span className={styles.item_name}>{name}</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Cates;
