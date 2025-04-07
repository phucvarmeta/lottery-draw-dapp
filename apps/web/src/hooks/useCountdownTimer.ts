import { useCallback, useRef, useState } from 'react';

import type { ICountdownTimer } from '@/types';
import { calculateTimeLeft } from '@/lib/common';

export const useCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<ICountdownTimer | null>(null);
  // eslint-disable-next-line no-undef
  const timer = useRef<NodeJS.Timeout>();

  const start = useCallback((targetDate?: Date) => {
    clearInterval(timer.current);

    timer.current = setInterval(() => {
      if (!targetDate) return;
      const currentDate = new Date();
      const updatedTimeLeft = calculateTimeLeft(targetDate, currentDate);
      if (!updatedTimeLeft) {
        clearInterval(timer.current);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft(updatedTimeLeft);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    clearInterval(timer.current);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    days: timeLeft?.days ?? 0,
    hours: timeLeft?.hours ?? 0,
    minutes: timeLeft?.minutes ?? 0,
    seconds: timeLeft?.seconds ?? 0,
    isStarted: timeLeft !== null,
    isEnded: timeLeft?.days === 0 && timeLeft?.hours === 0 && timeLeft?.minutes === 0 && timeLeft?.seconds === 0,
    start,
    reset,
  };
};
