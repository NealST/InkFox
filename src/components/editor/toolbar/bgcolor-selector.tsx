import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Palette, ChevronsUpDown } from 'lucide-react';
import type { ISelectorProps } from './types';
import styles from './index.module.css';

const BgColorSelector = function(props: ISelectorProps) {
  const { disabled } = props;
  const [color, setColor] = useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Palette size={16} />
          <ChevronsUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  )
};

export default BgColorSelector;
