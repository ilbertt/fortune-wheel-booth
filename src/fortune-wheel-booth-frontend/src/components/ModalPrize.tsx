import Fireworks from './Fireworks';
import CloseIcon from '../assets/close.svg';
import { PRIZES, PRIZES_VALUES_MAPPING } from '../constants';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface ModalPrizeProps {
  prizeNumber: number;
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  setMustSpin: Dispatch<SetStateAction<boolean>>;
}

export default function ModalPrize({
  prizeNumber,
  setShowModalPrize,
  setMustSpin,
}: ModalPrizeProps) {
  const wonPrize = useMemo(() => PRIZES[prizeNumber], [prizeNumber]);
  const wonPrizeValue = useMemo(
    () => PRIZES_VALUES_MAPPING[wonPrize.option],
    [wonPrize]
  );
  const isWinning = useMemo(() => wonPrize.option !== 'noPrize', [wonPrize]);

  return (
    <div className='absolute z-20 flex h-full w-full flex-col items-center justify-center backdrop-blur-2xl'>
      <button
        onClick={() => {
          setShowModalPrize(false);
          setMustSpin(false);
        }}
        className='absolute right-5 top-5 flex cursor-pointer items-center justify-center rounded-full bg-white p-1'
      >
        <img src={CloseIcon} className='h-[3vw]' alt='Close Icon'></img>
      </button>
      {isWinning && <Fireworks />}
      <div className='flex flex-col items-center justify-center gap-4'>
        {isWinning && (
          <>
            <p className='text-[6vw] font-bold uppercase text-white'>You won</p>
            {!wonPrize.hideModalImage && (
              <div className='prize-container-animation'>
                <img
                  src={wonPrize.modalImageUri || wonPrize.image?.uri}
                  alt='prize'
                  className='h-30'
                />
              </div>
            )}
          </>
        )}
        {wonPrizeValue && (
          <p className='prize-value-animation rounded-2xl bg-dfinity-gradient-dark p-2 px-4 text-[3vw] font-bold text-white'>
            {wonPrizeValue}
          </p>
        )}
      </div>
    </div>
  );
}
