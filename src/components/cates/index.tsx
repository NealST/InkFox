import { useEffect, useState, useRef, ChangeEvent } from "react";
import type { ICateItem } from "./types";
import getCates from "./controllers/get-cates";
import { createCate, renameCate, deleteCate } from "./controllers/cate-action";
import { useSelectedCate, type ICateState } from "./controllers/selected-cate";
import { useTranslation } from "react-i18next";
import { ChevronDown, Folder, FolderInput, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import cn from "classnames";
import { produce } from "immer";
import styles from "./index.module.css";

const Cates = function () {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([] as ICateItem[]);
  const [enterItem, setEnterItem] = useState({
    name: "",
    isEntering: false,
  });
  const { name: selectedCate, setName: setSelectedCate } = useSelectedCate(
    (state: ICateState) => state
  );
  const inputInfoRef = useRef({
    name: "",
    type: "add",
    index: 0,
  });

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
    inputInfoRef.current = {
      name: "",
      type: "add",
      index: 0,
    };
    setDataSource(newDataSource);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    inputInfoRef.current.name = event.target?.value;
  }

  function handleInputBlur() {
    const newCates = ([] as ICateItem[]).concat(dataSource);
    const inputInfo = inputInfoRef.current;
    const { name, type, index } = inputInfo;
    if (type === "add") {
      if (!name) {
        newCates.shift();
        setDataSource(newCates);
        return;
      }
      createCate(name)
        .then(() => {
          newCates[0] = {
            type: "cate",
            name: name,
          };
          setDataSource(newCates);
          inputInfoRef.current.name = "";
        })
        .catch(() => {
          newCates.shift();
          setDataSource(newCates);
          inputInfoRef.current.name = "";
        });
      return;
    }
    
    renameCate(dataSource[index].name, name).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index] = {
            ...draft[index],
            name,
            type: 'cate'
          }
        })
      );
    });
  }

  function handleSelect(item: ICateItem) {
    if (item.type === "input") {
      return;
    }
    setSelectedCate(item.name);
  }

  function handleEnter(item: ICateItem) {
    if (item.type === "input") {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: true,
    });
  }

  function handleLeave(item: ICateItem) {
    if (item.type === "input") {
      return;
    }
    setEnterItem({
      name: item.name,
      isEntering: false,
    });
  }

  function handleRename(index: number) {
    inputInfoRef.current = {
      name: dataSource[index].name,
      type: "rename",
      index,
    };
    setEnterItem({
      name: '',
      isEntering: false,
    });
    setDataSource(
      produce(dataSource, (draft) => {
        draft[index] = {
          ...draft[index],
          type: "input",
        };
      })
    );
  }

  function handleDelete(index: number) {
    deleteCate(dataSource[index].name).then(() => {
      setDataSource(produce(dataSource, draft => {
        draft.splice(index, 1);
      }));
    });
  }

  return (
    <div className={styles.cates}>
      <div className={styles.cates_header}>
        <div className={styles.header_label}>
          <ChevronDown style={{ marginRight: "8px" }} size={18} />
          <span className={styles.label_text}>{t("cates")}</span>
        </div>
        <Button className={styles.header_add} onClick={handleAddCate}>
          +
        </Button>
      </div>
      <div className={styles.cates_list}>
        {dataSource.length > 0 &&
          dataSource.map((item, index) => {
            const { name, type } = item;
            const isSelected = name === selectedCate;
            const isInput = type === "input";
            const FolderIcon = isInput ? FolderInput : Folder;
            return (
              <div
                className={cn(
                  styles.cate_item,
                  isSelected ? styles.cate_item_selected : "",
                  isInput ? styles.cate_item_input : ""
                )}
                key={index}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => handleEnter(item)}
                onMouseLeave={() => handleLeave(item)}
              >
                <div className={styles.cate_item_label}>
                  <FolderIcon
                    style={{
                      color: "hsl(var(--foreground))",
                      marginRight: "8px",
                    }}
                    size={18}
                  />
                  {isInput ? (
                    <Input
                      className={styles.item_input}
                      type="text"
                      defaultValue={name}
                      onInput={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                  ) : (
                    <span className={styles.item_name}>{name}</span>
                  )}
                </div>
                {enterItem.name === name && enterItem.isEntering && (
                  <div className={styles.cate_item_action}>
                    <Pencil
                      style={{
                        color: "hsl(var(--foreground))",
                        marginRight: "8px",
                      }}
                      size={14}
                      onClick={() => handleRename(index)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2
                          style={{
                            color: "var(--danger)",
                          }}
                          size={14}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("confirmDelete")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteWarn")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(index)}>{t("confirm")}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Cates;
