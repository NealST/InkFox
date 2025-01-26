import { useState, useEffect, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import styles from "./index.module.css";

const ColorTypeOptions = [
  { value: "HEX", label: "HEX" },
  { value: "RGB", label: "RGB" },
  // { value: 'HSB', label: 'HSB' }
];

export type ColorType = "HEX" | "RGB" | "HSB";

type TypeSelectProps = {
  value: ColorType;
  onChange: (v: ColorType) => void;
};

export default function TypeSelect(props: TypeSelectProps) {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleTrigger = () => {
    setOpen(!open);
  };

  const changeType = (t: ColorType) => {
    setOpen(false);
    onChange && onChange(t);
  };

  const clickHander = (e: MouseEvent) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const initClickOutSide = () => {
    document.addEventListener("click", clickHander);
    return () => {
      document.removeEventListener("click", clickHander);
    };
  };

  useEffect(() => {
    initClickOutSide();
  }, []);

  return (
    <div
      className={styles.rcs_panel_type_select}
      onClick={handleTrigger}
      ref={optionsRef}
    >
      <div className={styles.rcs_panel_type_select_trigger}>
        <span className={styles.rcs_panel_type_select_item}>{value}</span>
        <span className={styles.rcs_panel_type_select_arrow}>
          <ChevronsUpDown />
        </span>
      </div>

      {open ? (
        <div className={styles.rcs_panel_type_select_options}>
          {ColorTypeOptions.map((option) => (
            <span
              className={styles.rcs_panel_type_select_item}
              style={{ fontWeight: option.value === value ? "bold" : "normal" }}
              onClick={() => {
                changeType(option.value as ColorType);
              }}
            >
              {option.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
