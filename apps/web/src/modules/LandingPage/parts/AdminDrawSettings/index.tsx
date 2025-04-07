import CustomHeader from '@/components/DialogHeaderContainer';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { useDrawStore } from '@/stores/DrawStore';
import { ethers } from "ethers";
import { useUploadPrize } from '../../hooks/useUploadPrize';
import { useStartNewDraw } from '../../hooks/useStartNewDraw';
import { useGetCurrentDraw } from '@/apis/prize';
import { useSetDrawTime } from '../../hooks/useSetDrawDate';
import { usePerformDraw } from '../../hooks/usePerformDraw';


function AdminDrawSetting() {
  const prizeAmount = useDrawStore.use.prizeAmount();
  const nextDrawDate = useDrawStore.use.nextDrawDate();
  const setPrizeAmount = useDrawStore.use.setPrizeAmount();
  const setNextDrawDate = useDrawStore.use.setNextDrawDate();
  const amountInWei = ethers.parseEther(prizeAmount.toString());
  const {
    startNewDraw,
    isPendingStartNewDraw,
  } = useStartNewDraw(amountInWei);
  const {
    uploadPrize,
    isPendingUploadPrize,
  } = useUploadPrize(amountInWei);
  const {
    setDrawTime,
    isPendingSetDrawTime,
  } = useSetDrawTime();
  const {
    performDraw,
    isPendingPerformDraw,
  } = usePerformDraw();
  const { data: currentDraw } = useGetCurrentDraw();
  const isDefaultWinner = currentDraw?.winner === "0x0000000000000000000000000000000000000000";

  const canStartNewDraw = currentDraw?.completed && (isDefaultWinner || currentDraw?.prizeWithdrawn);
  console.log('canStartNewDraw', currentDraw, canStartNewDraw);
  const drawIsLive = currentDraw && !canStartNewDraw;
  const uploadedPrize = !!currentDraw?.prizeAmount;
  const updatedDate = !!currentDraw?.drawDate;
  const endedTime = !!currentDraw?.drawDate && new Date().getTime() > new Date(currentDraw.drawDate).getTime();

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 rounded-lg bg-[#0B2D4680] backdrop-blur-[50px]">
      <CustomHeader>Admin Panel - Lottery Settings</CustomHeader>
      <div className="py-5">
        <Button loading={isPendingStartNewDraw} disabled={!canStartNewDraw} onClick={() => startNewDraw()}
                className="w-full md:w-auto">
          {"New Lottery Draw"}
        </Button>
      </div>
      <div>
        {drawIsLive && (
          <div className="p-[1px] rounded-lg bg-[linear-gradient(90.03deg,_#63C4F5_10%,_#C5C0FB_50%,_#24E994_90%)]">
            <div className="flex flex-col gap-5 p-3 sm:p-5 rounded-lg bg-gray-900">
              {drawIsLive &&
                <div className='text-base sm:text-lg text-green-700'>Draw is living! ID: {currentDraw?.drawId}</div>}

              {/* Prize Upload Section */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="w-full sm:w-[300px] mb-2 sm:mb-0">
                  <Button
                    disabled={uploadedPrize}
                    loading={isPendingUploadPrize}
                    onClick={() => uploadPrize()}
                    className="w-full"
                  >
                    Upload Prize
                  </Button>
                </div>
                <Input
                  suffix={'BNB'}
                  disabled={uploadedPrize}
                  onChange={(e) => setPrizeAmount(e.target.value)}
                  defaultValue={currentDraw?.prizeAmount ? currentDraw.prizeAmount : prizeAmount}
                  className="w-full sm:w-[500px]"
                  placeholder="Input prize"
                />
              </div>

              {/* Date Setting Section */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="w-full sm:w-[300px] mb-2 sm:mb-0">
                  <Button
                    onClick={() => {
                      nextDrawDate && setDrawTime(nextDrawDate)
                    }}
                    loading={isPendingSetDrawTime}
                    disabled={!uploadedPrize || updatedDate}
                    className="w-full"
                  >
                    Set Date Next Draw
                  </Button>
                </div>
                <DateTimePicker
                  inputProps={{
                    disabled: !uploadedPrize || updatedDate,
                    className: 'w-full sm:w-[500px]',
                    placeholder: "Next Draw Date",
                  }}
                  defaultValue={currentDraw?.drawDate ? new Date(currentDraw.drawDate) : undefined}
                  onChange={(date) => {
                    if (date) {
                      setNextDrawDate(date)
                    }
                  }}
                />
              </div>

              {/* Perform Draw Button */}
              <div className="mt-2">
                <Button
                  loading={isPendingPerformDraw}
                  onClick={performDraw}
                  disabled={!uploadedPrize || !updatedDate || !endedTime || currentDraw.completed}
                  className="w-full sm:w-auto"
                >
                  Perform Draw
                </Button>
                <div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDrawSetting;
