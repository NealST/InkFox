import { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { Icon } from "@iconify/react";
import styles from "./index.module.css";
import { sceneList } from "@/config";

const Nav = function () {
  const [selectedNav, setSelectedNav] = useState(sceneList[0].id);

  return (
    <div className={styles.nav}>
      {sceneList.map((item) => {
        const { id, icon, label, path } = item;
        const isSelected = selectedNav === id;
        return (
          <div
            className={cn(
              styles.nav_item,
              isSelected ? styles.nav_item_selected : ""
            )}
            key={id}
            onClick={() => setSelectedNav(id)}
          >
            <Icon icon={icon} width="24" height="24" />
            <Link to={path}>{label}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default Nav;
