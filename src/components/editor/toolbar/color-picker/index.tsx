import { useEffect, useState } from "react";
import RcColorPicker from "@rc-component/color-picker";
import { Color, getColorStringByFormat, hasValue } from "./controller";
import type { ColorFormat } from "./controller";
import ColorInput from "./color-input";
import PresetColors from "./preset-colors";
import '@rc-component/color-picker/assets/index.css';
import styles from './index.module.css';

export interface ComponentProps {
  format?: ColorFormat;
  value?: string | Color;
  onChange?: (value: string) => void;
  panelRender?: (panel: React.ReactElement) => React.ReactElement;
  [key: string]: any;
}

const handleColor = (c: string | Color) => {
  if (typeof c === "string") return new Color(c);
  return c;
};

export default function ColorPicker(props: ComponentProps) {
  const { format = "rgb", value, onChange, panelRender } = props;
  const [color, setColor] = useState<Color>();

  const handleChange = (v: Color) => {
    onChange && onChange(getColorStringByFormat(v, format));
  };

  const handlePresetChange = (v: string) => {
    const c = new Color(v);
    onChange && onChange(getColorStringByFormat(c, format));
  };

  useEffect(() => {
    if (hasValue(value)) {
      setColor(handleColor(value || ''));
    }
  }, [value]);

  return (
    <RcColorPicker
      value={color}
      onChange={handleChange}
      panelRender={(innerPanel: React.ReactElement) => {
        const panel = (
          <div className={styles.rcs_panel}>
            <PresetColors value={value} onChange={handlePresetChange} />
            {innerPanel}
            <ColorInput format={format} value={color} onChange={handleChange} />
          </div>
        );
        if (typeof panelRender === "function") {
          return panelRender(panel);
        }
        return panel;
      }}
    />
  );
}
