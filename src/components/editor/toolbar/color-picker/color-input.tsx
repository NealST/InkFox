import { useState, useEffect } from "react";
import { InputNumber, Input } from "./input";
import type { ValueType } from "./input";
import { Color } from "@rc-component/color-picker";
import { ColorFormat } from "./controller";
import type { RGB } from "@rc-component/color-picker";
import cn from "classnames";
import styles from "./index.module.css";

type ColorInputProps = {
  format: ColorFormat;
  value?: Color;
  onChange?: (color: Color) => void;
};

export default function ColorInput(props: ColorInputProps) {
  const { value, onChange } = props;
  const [hexValue, setHexValue] = useState("");
  const [rgbValue, setRgbValue] = useState<RGB>();

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setHexValue(v);
    if (v?.length === 6) {
      const color = new Color(v);
      if (color.isValid) {
        onChange && onChange(color);
      }
    }
  };

  const renderHexInput = () => {
    return (
      <div
        className={cn(styles.rcs_panel_input_hex)}
      >
        <Input value={hexValue} onChange={handleHexChange} />
        <div className={styles.rcs_panel_input_hex_label}>HEX</div>
      </div>
    );
  };

  const handleRgbChange = (v: ValueType | null, key: string) => {
    if (!v) {
      return;
    }
    const rgb = { ...rgbValue, [key]: v };
    // @ts-ignore
    const color = new Color(rgb);
    if (color.isValid) {
      onChange?.(color);
    }
  };

  const renderRGBInput = () => {
    return (
      <div
        className={cn(styles.rcs_panel_input_rgb)}
      >
        <div className={styles.input_rgb_item}>
          <InputNumber
            value={rgbValue?.r}
            min={0}
            max={255}
            onChange={(v) => {
              handleRgbChange(v, "r");
            }}
          />
          <div className={styles.input_rgb_item_label}>R</div>
        </div>

        <div className={styles.input_rgb_item}>
          <InputNumber
            value={rgbValue?.g}
            min={0}
            max={255}
            onChange={(v) => {
              handleRgbChange(v, "g");
            }}
          />
          <div className={styles.input_rgb_item_label}>G</div>
        </div>

        <div className={styles.input_rgb_item}>
          <InputNumber
            value={rgbValue?.b}
            min={0}
            max={255}
            onChange={(v) => {
              handleRgbChange(v, "b");
            }}
          />
          <div className={styles.input_rgb_item_label}>B</div>
        </div>
      </div>
    );
  };

  const renderAlpha = () => {
    const alpha = value?.a || 1;
    return (
      <div className={styles.rcs_panel_input_alpha}>
        <InputNumber
          style={{ width: 48 }}
          min={0}
          max={100}
          value={alpha * 100}
        />
        <div className={styles.rcs_panel_input_alpha_label}>Alpha</div>
      </div>
    );
  };

  useEffect(() => {
    if (value) {
      setHexValue(value.toHexString().replace("#", ""));
      setRgbValue(value.toRgb());
    }
  }, [value]);

  return (
    <div className={styles.rcs_panel_input}>
      {renderHexInput()}
      {renderRGBInput()}
      {renderAlpha()}
    </div>
  );
}
