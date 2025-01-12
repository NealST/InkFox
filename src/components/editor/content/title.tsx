import { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import styles from "./index.module.css";

export interface ITitleState {
  name: string;
  setName: (newName: string) => void;
}

export const useTitle = create<ITitleState>((set) => ({
  name: "",
  setName: (newName: string) => {
    set({ name: newName });
  },
}));

const Title = function () {
  const { t } = useTranslation();
  const setTitle = useTitle((state: ITitleState) => state.setName);
  const selectedArticleName = useSelectedArticle(
    (state: IArticleState) => state.name
  );

  useEffect(() => {
    setTitle(selectedArticleName);
  }, [selectedArticleName]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  return (
    <div className={styles.title}>
      <Input
        type="text"
        placeholder={t("untitled")}
        value={selectedArticleName}
        onChange={handleChange}
      />
    </div>
  );
};

export default Title;
