import { Ended, Live } from '@/components/Live';

type Props = {
  isTimeEnded: boolean;
};

export const LiveEvent = ({ isTimeEnded }: Props) => {
  return isTimeEnded ? <Ended /> : <Live />;
};
