import Fireworks from './Fireworks';
import { findPrize } from '../utils/findPrize';
import CloseIcon from '../assets/close.svg';
import { ModalPrizeProps } from '../types';
import { PRIZES } from '../costants';

export default function ModalPrize({
  prizeNumber,
  setShowModalPrize,
}: ModalPrizeProps) {
  const wonPrize = PRIZES[findPrize(Object.keys(prizeNumber)[0])];
  return (
    <div className='absolute flex justify-center items-center backdrop-blur-2xl h-full w-full z-20 flex-col'>
      <button
        onClick={() => setShowModalPrize(false)}
        className='absolute top-5 right-5 bg-white rounded-full p-1 cursor-pointer flex justify-center items-center'
      >
        <img src={CloseIcon} className='h-[3vw]' alt='Close Icon'></img>
      </button>
      <Fireworks />
      <div className='flex flex-col justify-center items-center gap-3'>
        <p className='text-[6vw] font-bold text-white uppercase'>You won!</p>
        <div className='prize-container-animation'>
          <img
            src={wonPrize.image?.uri}
            alt='prize'
            className='prize-animation h-30'
          />
        </div>
      </div>
    </div>
  );
}
