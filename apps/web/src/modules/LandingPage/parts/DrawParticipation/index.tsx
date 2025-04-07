'use client';

import { useGetCurrentDraw } from '@/apis/prize';
import CustomHeader from '@/components/DialogHeaderContainer';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParticipateInDraw } from '../../hooks/useParticipateToNextDraw';
import { useWithdrawPrize } from '../../hooks/withdrawPrize';
import { useAccount } from 'wagmi';
import { EventTime } from './components/EventTime';
import { useIsMounted } from '@/hooks/useIsMounted';

function DrawParticipation() {
  const { address } = useAccount();
  const { data: currentDraw, isFetching: currentDrawFetching, refetch: refetchCurrentDraw } = useGetCurrentDraw();
  const drawDate = currentDraw?.drawDate;
  const isDefaultWinner = currentDraw?.winner === '0x0000000000000000000000000000000000000000';
  const drawIsStarted = !currentDraw?.prizeWithdrawn || !isDefaultWinner;
  const timer = useCountdownTimer();

  // Transaction states
  const [isParticipating, setIsParticipating] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { participateInDraw, isPendingParticipateInDraw } = useParticipateInDraw();
  const { withdrawPrize, isPendingWithDrawPrize } = useWithdrawPrize();

  const isParticipated = Object.values(currentDraw?.participants || {}).includes(address as string);
  const participants = Object.entries(currentDraw?.participants || {});
  const reachParticipantsLimit = participants.length >= 20;
  const mounted = useIsMounted();

  const isTimeEnded = timer.isEnded;
  const isDrawTimeSet = !!drawDate;

  const canParticipate = !!address &&
    mounted &&
    isDrawTimeSet &&
    !isTimeEnded &&
    !isParticipated &&
    !reachParticipantsLimit;

  useEffect(() => {
    if (drawDate && new Date().getTime() <= (new Date(drawDate)?.getTime?.() || 0)) {
      timer.start(new Date(drawDate));
    }
  }, [drawDate, timer]);

  // Handle participation with proper loading state
  const handleParticipate = async () => {
    if (!canParticipate) return;

    try {
      setIsParticipating(true);
      await participateInDraw();
      // Refetch data after transaction completes
      await refetchCurrentDraw();
    } catch (error) {
      console.error("Error participating in draw:", error);
    } finally {
      setIsParticipating(false);
    }
  };

  // Handle withdraw with proper loading state
  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await withdrawPrize();
      // Refetch data after transaction completes
      await refetchCurrentDraw();
    } catch (error) {
      console.error("Error withdrawing prize:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Determine actual loading states combining both sources
  const participateLoading = isPendingParticipateInDraw || isParticipating;
  const withdrawLoading = isPendingWithDrawPrize || isWithdrawing;

  // Function to truncate address for mobile display
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getParticipationStatusMessage = () => {
    if (isParticipated) {
      return "You have participated in this draw";
    } else if (!isDrawTimeSet) {
      return "Draw time has not been set yet";
    } else if (isTimeEnded) {
      return "Draw time has ended";
    } else if (reachParticipantsLimit) {
      return "Participant limit reached (20/20)";
    }
    return "";
  };

  return (
    <div className="flex flex-col w-full p-3 md:p-4 lg:p-8 rounded-lg bg-[#0B2D4680] backdrop-blur-[50px]">
      <CustomHeader>End User - Lottery Participation</CustomHeader>

      <div className="mt-4 p-[1px] rounded-lg bg-[linear-gradient(90.03deg,_#63C4F5_10%,_#C5C0FB_50%,_#24E994_90%)]">
        <div className="p-4 md:p-5 bg-gray-900 rounded-lg">
          <div>
            <EventTime
              days={timer.days}
              hours={timer.hours}
              minutes={timer.minutes}
              seconds={timer.seconds}
              isFetching={currentDrawFetching}
              isTimeEnded={isTimeEnded}
            />
          </div>

          <div className="font-medium mt-4 text-sm md:text-base">
            Next Lottery Draw: {drawDate ? format(drawDate, "dd/MM/yyyy HH:mm:ss'") : 'Not set yet'}
          </div>

          <div>
            <div className="italic text-sm">Prize: {currentDraw?.prizeAmount || 0} BNB</div>
          </div>

          <div className="mt-4">
            <div className="font-bold text-base md:text-xl break-words">
              WINNER: {!isDefaultWinner ?
              <span className="break-all text-sm md:text-base">{currentDraw?.winner}</span> :
              '-'
            }
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 flex flex-col sm:flex-row gap-3">
        <Button
          loading={participateLoading}
          onClick={handleParticipate}
          disabled={!canParticipate}
          className="w-full sm:w-auto"
        >
          Participate to next draw
        </Button>

        <Button
          loading={withdrawLoading}
          onClick={handleWithdraw}
          disabled={!address || !isDefaultWinner || currentDraw?.prizeWithdrawn}
          className="w-full sm:w-auto"
        >
          Withdraw Prize
        </Button>
      </div>

      {getParticipationStatusMessage() && (
        <div className="text-sm italic mb-3">{getParticipationStatusMessage()}</div>
      )}

      <div className="p-3 md:p-5 overflow-x-auto">
        <div className="text-lg font-semibold mb-3">Available Tickets ({participants.length} / 20)</div>

        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableCell className="py-2 px-2 md:px-4">Address</TableCell>
                <TableCell className="py-2 px-2 md:px-4">TicketID</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {participants.map(([index, participant]) => (
                <TableRow key={participant}>
                  <TableCell className="py-2 px-2 md:px-4">
                    <span className="hidden md:block">{participant}</span>
                    <span className="block md:hidden">{truncateAddress(participant)}</span>
                  </TableCell>
                  <TableCell className="py-2 px-2 md:px-4">{index}</TableCell>
                </TableRow>
              ))}
              {participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="py-4 text-center text-gray-400">
                    No participants yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DrawParticipation;
