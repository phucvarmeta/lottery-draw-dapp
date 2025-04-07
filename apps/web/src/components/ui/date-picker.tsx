import * as React from 'react';

import { cn } from '@/lib/utils';
import { Popover } from '@radix-ui/react-popover';
import { PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { add, format } from 'date-fns';
import { TimePicker } from './time-picker';
import { Matcher } from 'react-day-picker';

interface Props {
  inputProps: InputProps;
  onChange: (date: Date | undefined) => void;
  disabled?: Matcher;
  defaultValue?: Date;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  containerClassName?: InputProps['className'];
}

const DateTimePicker = (props: Props) => {
  const { onChange, disabled, inputProps } = props;
  const { className, type, suffix, prefix, containerClassName, ...rest } = props.inputProps;
  const [date, setDate] = React.useState<Date>(props.defaultValue || new Date());

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      onChange?.(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
    onChange?.(newDateFull);
  };

  return (
    <Popover>
      <div className={cn('relative', containerClassName)}>
        {prefix && <label className={cn('absolute left-[10px] top-1/2 -translate-y-1/2')}>{prefix}</label>}

        <input
          readOnly
          value={date ? format(date, 'dd/MM/yyyy HH:mm:ss') : "Pick a day"}
          type={type}
          className={cn(
            'pr-10 flex h-10 w-full rounded-sm bg-navigate-tab px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'pl-10': prefix,
            },
            className
          )}
          {...rest}
        />

        <PopoverTrigger disabled={inputProps.disabled}>
          <CalendarIcon className={cn('absolute right-[10px] top-5 -translate-y-1/2 z-10')} />
        </PopoverTrigger>
        <PopoverContent>
          <Calendar mode='single' selected={date} onSelect={(d) => handleSelect(d)} initialFocus disabled={disabled} />

          <div className='border-border border-t p-3'>
            <TimePicker setDate={(date) => {
              setDate(date);
              onChange?.(date);
            }} date={date} />
          </div>

        </PopoverContent>

      </div>
    </Popover>
  );
}
DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
