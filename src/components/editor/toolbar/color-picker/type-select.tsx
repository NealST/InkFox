import { useState, useEffect, useRef } from "react";

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
      className="rcs-panel-type-select"
      onClick={handleTrigger}
      ref={optionsRef}
    >
      <div className="rcs-panel-type-select-trigger">
        <span className="rcs-panel-type-select-item">{value}</span>
        <span className="rcs-panel-type-select-arrow">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="down"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
          </svg>
        </span>
      </div>

      {open ? (
        <div className="rcs-panel-type-select-options">
          {ColorTypeOptions.map((option) => (
            <span
              className="rcs-panel-type-select-item"
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
