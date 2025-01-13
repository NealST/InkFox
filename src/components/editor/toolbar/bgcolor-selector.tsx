import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Palette, ChevronsUpDown } from 'lucide-react';
import styles from './index.module.css';

const BgColorSelector = function() {
  const [color, setColor] = useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.tool_button} variant="ghost">
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
