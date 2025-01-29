import RcInputNumber from 'rc-input-number';
import RcInput from 'rc-input';
import type { InputNumberProps } from 'rc-input-number';
import type { InputProps } from 'rc-input';
import cn from 'classnames';
import 'rc-input/assets/index.css';
import 'rc-input-number/assets/index.css';
import styles from './index.module.css';

export const InputNumber = (props: InputNumberProps) => {
  return (
    <RcInputNumber prefixCls={cn('rc-input-number', styles.rc_input_number)} controls={false}  {...props} />
  );
}

export const Input = (props: InputProps) => {
  return (
    <RcInput prefixCls={cn('rc-input', styles.rc_input)} {...props} />
  );
}

export type { ValueType } from 'rc-input-number';
