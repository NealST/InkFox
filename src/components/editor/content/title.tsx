import { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import {
  useToolbarDisabled,
  type IToolbarDisable,
} from "../controllers/toolbar-disable";
import styles from "./index.module.css";

export interface ITitleState {
  title: string;
  setTitle: (newName: string) => void;
}

export const useTitle = create<ITitleState>((set) => ({
  title: "",
  setTitle: (newTitle: string) => {
    set({ title: newTitle });
  },
}));

const Title = function () {
  const { t } = useTranslation();
  const selectedArticleName = useSelectedArticle(
    (state: IArticleState) => state.name
  );
  const setToolbarDisabled = useToolbarDisabled(
    (state: IToolbarDisable) => state.setDisabled
  );
  const { title, setTitle } = useTitle((state: ITitleState) => state);

  useEffect(() => {
    setTitle(selectedArticleName);
  }, [selectedArticleName]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleFocus() {
    // disable the toolbar when title input get focus
    setToolbarDisabled(true);
  }

  return (
    <div className={styles.title}>
      <Input
        type="text"
        className={styles.title_input}
        placeholder={t("untitled")}
        value={title}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default Title;
