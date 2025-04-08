'use client';

import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import LotteryWheel from '@/components/lottery-wheel';
import WinnerModal from '@/components/winner-modal';
import { ERC721Abi } from '@/contracts/abi';
import { useAccount, useConnect, useDisconnect, useConnectors, Connector } from 'wagmi';
import { useStartNewDraw } from './hooks/useCreateNewDraw';

// Contract address would be set after deployment
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function LandingPage() {
  const { connectors, connect, isPending, variables, isError, failureReason, status } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const [isClient, setIsClient] = useState(false);
  const { startNewDraw, isPendingStartNewDraw } = useStartNewDraw();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [currentDraw, setCurrentDraw] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showWheel, setShowWheel] = useState<boolean>(false);
  const [winningTicket, setWinningTicket] = useState<number | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [prizePool, setPrizePool] = useState<string>('0');

  const isConnected = useMemo(() => account && account.isConnected, [status]);
  const metaMaskWallet = connectors.find((x) => x.id === 'metaMaskSDK');

  const refreshDrawData = async () => {
    // if (!contract) return;
    // try {
    //   const drawData = await contract.getCurrentDraw();
    //   setCurrentDraw({
    //     id: drawData.id.toNumber(),
    //     timestamp: drawData.timestamp.toNumber(),
    //     participants: drawData.participants,
    //     completed: drawData.completed,
    //     winningTicket: drawData.winningTicket.toNumber(),
    //     winner: drawData.winner,
    //     prizeClaimed: drawData.prizeClaimed,
    //     ticketsSold: drawData.ticketsSold.toNumber(),
    //   });
    //   const prizePoolWei = drawData.currentPrizePool;
    //   setPrizePool(ethers.formatEther(prizePoolWei));
    // } catch (err) {
    //   console.error('Failed to get current draw:', err);
    //   setError('Failed to fetch lottery data');
    // }
  };

  // const startNewDraw = async () => {
  // if (!contract || !signer) return;
  // try {
  //   setLoading(true);
  //   setError('');
  //   const contractWithSigner = contract.connect(signer);
  //   const tx = await contractWithSigner.startNewDraw();
  //   await tx.wait();
  //   await refreshDrawData();
  //   disconnectWallet();
  // } catch (err: any) {
  //   console.error('Failed to start new draw:', err);
  //   setError(err.message || 'Failed to start new draw');
  // } finally {
  //   setLoading(false);
  // }
  // };

  const buyTicket = async () => {
    // if (!contract || !signer) return;
    // try {
    //   setLoading(true);
    //   setError('');
    //   const contractWithSigner = contract.connect(signer);
    //   const tx = await contractWithSigner.buyTicket({
    //     value: ethers.utils.parseEther('0.001'),
    //   });
    //   await tx.wait();
    //   await refreshDrawData();
    //   disconnectWallet();
    // } catch (err: any) {
    //   console.error('Failed to buy ticket:', err);
    //   setError(err.message || 'Failed to buy ticket');
    // } finally {
    //   setLoading(false);
    // }
  };

  const performDraw = async () => {
    // if (!contract || !signer) return;
    // try {
    //   setLoading(true);
    //   setError('');
    //   const contractWithSigner = contract.connect(signer);
    //   const tx = await contractWithSigner.performDraw();
    //   const receipt = await tx.wait();
    //   // Find the DrawCompleted event
    //   const event = receipt.events?.find((e) => e.event === 'DrawCompleted');
    //   if (event && event.args) {
    //     const winningTicketNumber = event.args.winningTicket.toNumber();
    //     const winnerAddress = event.args.winner;
    //     setWinningTicket(winningTicketNumber);
    //     setWinner(winnerAddress);
    //     setShowWheel(true);
    //     // After wheel animation completes, show winner modal
    //     setTimeout(() => {
    //       setShowWinnerModal(true);
    //       setShowWheel(false);
    //     }, 5000);
    //   }
    //   await refreshDrawData();
    //   disconnectWallet();
    // } catch (err: any) {
    //   console.error('Failed to perform draw:', err);
    //   setError(err.message || 'Failed to perform draw');
    // } finally {
    //   setLoading(false);
    // }
  };

  const claimPrize = async () => {
    // if (!contract || !signer) return;
    // try {
    //   setLoading(true);
    //   setError('');
    //   const contractWithSigner = contract.connect(signer);
    //   const tx = await contractWithSigner.claimPrize();
    //   await tx.wait();
    //   await refreshDrawData();
    //   disconnectWallet();
    // } catch (err: any) {
    //   console.error('Failed to claim prize:', err);
    //   setError(err.message || 'Failed to claim prize');
    // } finally {
    //   setLoading(false);
    // }
  };

  const renderTicketTable = () => {
    const tickets = [];

    for (let i = 1; i <= 10; i++) {
      const participant = currentDraw?.participants[i] || null;
      const isWinningTicket = currentDraw?.completed && currentDraw?.winningTicket === i;

      tickets.push(
        <TableRow key={i} className={isWinningTicket ? 'bg-green-100 dark:bg-green-900' : ''}>
          <TableCell className="font-medium">{i}</TableCell>
          <TableCell>
            {participant && participant !== ethers.ZeroAddress
              ? `${participant.substring(0, 6)}...${participant.substring(38)}`
              : 'Available'}
            {isWinningTicket && ' (WINNER)'}
          </TableCell>
        </TableRow>
      );
    }

    return tickets;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-8">Decentralized Lottery (DLottery)</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lottery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Draw ID:</strong> {currentDraw?.id || 'No active draw'}
                </p>
                <p>
                  <strong>Status:</strong> {currentDraw?.completed ? 'Completed' : 'Active'}
                </p>
                <p>
                  <strong>Tickets Sold:</strong> {currentDraw?.ticketsSold || 0}/5
                </p>
                <p>
                  <strong>Prize Pool:</strong> {prizePool} ETH
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {isClient &&
                  (!isConnected ? (
                    <Button onClick={() => connect({ connector: metaMaskWallet })} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Connect Wallet
                    </Button>
                  ) : (
                    <div className="text-sm mb-2">
                      Connected: {account.address?.substring(0, 6)}...{account.address?.substring(38)}
                    </div>
                  ))}
                {isConnected && (
                  <Button
                    onClick={() =>
                      disconnect({
                        connector: metaMaskWallet,
                      })
                    }
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Disconnect Wallet
                  </Button>
                )}
                {isConnected && account && currentDraw && !currentDraw.completed && currentDraw.ticketsSold < 5 && (
                  <Button onClick={buyTicket} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Buy Ticket (0.001 ETH)
                  </Button>
                )}

                {isConnected && account && currentDraw && !currentDraw.completed && currentDraw.ticketsSold === 5 && (
                  <Button onClick={performDraw} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Perform Lottery Draw
                  </Button>
                )}

                {isConnected &&
                  account &&
                  currentDraw &&
                  currentDraw.completed &&
                  currentDraw.winner === account &&
                  !currentDraw.prizeClaimed && (
                    <Button onClick={claimPrize} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Claim Winner Prize
                    </Button>
                  )}

                {isConnected &&
                  currentDraw &&
                  currentDraw.completed &&
                  (currentDraw.prizeClaimed || currentDraw.winner === ethers.ZeroAddress) && (
                    <Button onClick={startNewDraw} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Start New Lucky Draw
                    </Button>
                  )}

                {isConnected && !currentDraw && account && (
                  <Button onClick={startNewDraw} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Start New Lucky Draw
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lottery Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Participant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDraw ? (
                  renderTicketTable()
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No active draw
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {showWheel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Spinning the Wheel!</h2>
            <LotteryWheel winningNumber={winningTicket || 1} />
          </div>
        </div>
      )}

      {showWinnerModal && (
        <WinnerModal
          winner={winner}
          winningTicket={winningTicket}
          prizePool={prizePool}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
    </main>
  );
}
