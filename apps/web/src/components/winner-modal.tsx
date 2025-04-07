'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ethers } from 'ethers';

interface WinnerModalProps {
  winner: string | null;
  winningTicket: number | null;
  prizePool: string;
  onClose: () => void;
}

export default function WinnerModal({ winner, winningTicket, prizePool, onClose }: WinnerModalProps) {
  const hasWinner = winner && winner !== ethers.constants.AddressZero;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">{hasWinner ? '🎉 Congratulations! 🎉' : '😢 No Winner 😢'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {hasWinner ? (
            <>
              <p className="mb-2">Ticket #{winningTicket} is the winner!</p>
              <p className="mb-4">Winner Address:</p>
              <p className="font-mono bg-muted p-2 rounded-md break-all">{winner}</p>
              <p className="mt-4">Prize Amount: {prizePool} ETH</p>
            </>
          ) : (
            <>
              <p className="mb-2">Ticket #{winningTicket} was drawn</p>
              <p className="mb-4">But no one purchased this ticket!</p>
              <p className="mt-4">The prize pool of {prizePool} ETH will roll over to the next draw.</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
