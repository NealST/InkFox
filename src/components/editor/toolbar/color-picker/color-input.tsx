import { useState, useEffect } from "react";
import TypeSelect from "./type-select";
import type { ColorType } from "./type-select";
import { InputNumber, Input } from "./input";
import type { ValueType } from "./input";
import { Color } from "@rc-component/color-picker";
import { ColorFormat, getIntColorValue } from "./controller";
import type { RGB, HSB } from "@rc-component/color-picker";
import cn from 'classnames';
import styles from './index.module.css';

type ColorInputProps = {
  format: ColorFormat;
  value?: Color;
  onChange?: (color: Color) => void;
};

export default function ColorInput(props: ColorInputProps) {
  const { format, value, onChange } = props;
  const [colorType, setColorType] = useState<ColorType>(
    format.toUpperCase() as ColorType
  );
  const [hexValue, setHexValue] = useState("");
  const [rgbValue, setRgbValue] = useState<RGB>();
  const [hsbValue, setHsbValue] = useState<HSB>();

  const handleColorTypeChange = (t: ColorType) => {
    setColorType(t);
  };

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
      <div className={cn(styles.rcs_panel_input_type, styles.rcs_panel_input_hex)}>
        <Input value={hexValue} prefix="#" onChange={handleHexChange} />
      </div>
    );
  };

  const handleRgbChange = (v: ValueType | null, key: string) => {
    if (!v) {
      return;
    }
    const rgb = { ...rgbValue, [key]: v, };
    // @ts-ignore
    const color = new Color(rgb);
    if (color.isValid) {
      onChange?.(color);
    }
  };

  const renderRGBInput = () => {
    return (
      <div className={cn(styles.rcs_panel_input_type, styles.rcs_panel_input_rgb)}>
        <InputNumber
          value={rgbValue?.r}
          min={0}
          max={255}
          onChange={(v) => {
            handleRgbChange(v, "r");
          }}
        />
        <InputNumber
          value={rgbValue?.g}
          min={0}
          max={255}
          onChange={(v) => {
            handleRgbChange(v, "g");
          }}
        />
        <InputNumber
          value={rgbValue?.b}
          min={0}
          max={255}
          onChange={(v) => {
            handleRgbChange(v, "b");
          }}
        />
      </div>
    );
  };

  const handleHsbChange = (v: ValueType | null, key: string) => {
    if (!v) {
      return;
    }
    const hsb = {
      ...hsbValue,
      [key]: v,
    };
    hsb.b = (hsb.b as number) / 100;
    hsb.s = (hsb.s as number) / 100;
    // @ts-ignore
    const color = new Color(hsb);
    if (color.isValid) {
      onChange && onChange(color);
    }
  };

  const renderHSBInput = () => {
    return (
      <div className={cn(styles.rcs_panel_input_type, styles.rcs_panel_input_hsb)}>
        <InputNumber
          value={hsbValue?.h}
          min={0}
          max={360}
          className={styles.rc_input_number_affix_wrapper}
          onChange={(v) => {
            handleHsbChange(v, "h");
          }}
        />
        <InputNumber
          value={hsbValue?.s}
          min={0}
          max={100}
          suffix="%"
          onChange={(v) => {
            handleHsbChange(v, "s");
          }}
        />
        <InputNumber
          value={hsbValue?.b}
          min={0}
          max={100}
          suffix="%"
          onChange={(v) => {
            handleHsbChange(v, "b");
          }}
        />
      </div>
    );
  };

  const renderAlpha = () => {
    const alpha = value?.a || 1;
    return (
      <div className={styles.rcs_panel_input_alpha}>
        <InputNumber
          suffix="%"
          style={{ width: 48 }}
          min={0}
          max={100}
          value={alpha * 100}
        />
      </div>
    );
  };

  useEffect(() => {
    if (value) {
      setHexValue(value.toHexString().replace("#", ""));
      setRgbValue(value.toRgb());
      const hsb = value.toHsb();
      setHsbValue({
        h: getIntColorValue(hsb.h),
        s: getIntColorValue(hsb.s, true),
        b: getIntColorValue(hsb.b, true),
      });
    }
  }, [value]);

  return (
    <div className={styles.rcs_panel_input}>
      <TypeSelect value={colorType} onChange={handleColorTypeChange} />
      <div className={styles.rcs_panel_input_types}>
        {colorType === "HEX" && renderHexInput()}
        {colorType === "RGB" && renderRGBInput()}
        {colorType === "HSB" && renderHSBInput()}
      </div>
      {renderAlpha()}
    </div>
  );
}
