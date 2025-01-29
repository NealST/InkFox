import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import ColorPicker from './color-picker';
import { Baseline, ChevronsUpDown } from 'lucide-react';
import type { IColorSelectorProps } from './types';
import styles from './index.module.css';

const FontColorSelector = function(props: IColorSelectorProps) {
  const { disabled, initialColor = '' } = props;
  const [color, setColor] = useState(initialColor);
  function handleChange(newColor: string) {
    setColor(newColor);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Baseline color={color} />
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ColorPicker value={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
};

export default FontColorSelector;
