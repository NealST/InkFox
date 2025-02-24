import Cates from "../cates";
import Articles from "../articles";
import More from "../more";
import useFocusMode from "../editor/controllers/focus-mode";
import { motion } from "motion/react";
import styles from "./index.module.css";

const SideBar = function () {
  const isFocusMode = useFocusMode((state) => state.isFocusMode);

  return (
    <motion.div
      className={styles.side_bar}
      animate={{display: isFocusMode ? "none" : "flex"}}
    >
      <section className={styles.bar_cates}>
        <Cates />
        <More />
      </section>
      <section className={styles.bar_articles}>
        <Articles />
      </section>
    </motion.div>
  );
};

export default SideBar;
