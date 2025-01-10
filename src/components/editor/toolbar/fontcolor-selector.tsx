import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Baseline, ChevronsUpDown } from 'lucide-react';

const FontColorSelector = function() {
  const [color, setColor] = useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Baseline />
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  )
};

export default FontColorSelector;
