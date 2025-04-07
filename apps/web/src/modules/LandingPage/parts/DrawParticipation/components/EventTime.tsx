import { HStack, Show } from '@/components/ui/Utilities';
import { LiveEvent } from './LiveEvent';

type Props = {
  isFetching: boolean;
  isTimeEnded: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const EventTime = ({ days, hours, isFetching, isTimeEnded, minutes, seconds }: Props) => {
  if (isFetching)
    return (
      <div className="grid grid-cols-2 gap-4">
        <HStack align={'center'} spacing={8} className="animate-pulse">
          <div className="h-4 w-4 bg-slate-500 rounded-full"></div>

          <div className="h-6 w-8 bg-slate-500" />
        </HStack>

        <div className="h-6 w-32 bg-slate-500" />
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4">
      <LiveEvent isTimeEnded={isTimeEnded} />

      <Show when={!isTimeEnded}>
        <p>{`${days}d:${hours}h:${minutes}m:${seconds}s`}</p>
      </Show>
    </div>
  );
};
