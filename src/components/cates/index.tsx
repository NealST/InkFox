import { useEffect, useState, useRef, ChangeEvent } from "react";
import type { ICateItem } from "./types";
import getCates from "./controllers/get-cates";
import createCate from "./controllers/create-cate";
import { useSelectedCate, type ICateState } from "./controllers/selected-cate";
import { useTranslation } from "react-i18next";
import { ChevronDown, SquarePlus, Folder, FolderInput } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from '@/components/ui/button';
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
    getCates().then((ret) => {
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

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    newCateNameRef.current = event.target?.value;
  }

  function handleInputBlur() {
    const newCates = ([] as ICateItem[]).concat(dataSource);
    const newCateName = newCateNameRef.current;
    if (!newCateName) {
      newCates.shift();
      setDataSource(newCates);
      return;
    }
    createCate(newCateName)
      .then(() => {
        newCates[0] = {
          type: "cate",
          name: newCateName,
        };
        setDataSource(newCates);
        newCateNameRef.current = '';
      })
      .catch(() => {
        newCates.shift();
        setDataSource(newCates);
        newCateNameRef.current = '';
      });
  }

  return (
    <div className={styles.cates}>
      <div className={styles.cates_header}>
        <div className={styles.header_label}>
          <ChevronDown style={{ marginRight: "8px" }} size={18} />
          <span className={styles.label_text}>{t("cates")}</span>
        </div>
        <Button className={styles.header_add}>+</Button>
      </div>
      <div className={styles.cates_list}>
        {dataSource.length > 0 &&
          dataSource.map((item, index) => {
            const { name, type } = item;
            const isSelected = name === selectedCate;
            const FolderIcon = type === "input" ? FolderInput : Folder;
            return (
              <div
                className={cn(
                  styles.cate_item,
                  isSelected ? styles.cate_item_selected : ""
                )}
                key={index}
                onClick={() => setSelectedCate(name)}
              >
                <FolderIcon
                  style={{
                    color: "hsl(var(--foreground))",
                    marginRight: "8px",
                  }}
                  size={18}
                />
                {type === "input" ? (
                  <Input
                    className={styles.item_input}
                    type="text"
                    onInput={handleInputChange}
                    onBlur={handleInputBlur}
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
