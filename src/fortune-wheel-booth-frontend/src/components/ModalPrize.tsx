import Fireworks from './Fireworks';
import { Prize } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { findPrize } from '../utils/findPrize';
import { Dispatch, SetStateAction } from 'react';
import CloseIcon from '../../public/close.svg';

interface ModalPrizeProps {
  prizeNumber: Prize;
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
}

export default function ModalPrize({
  prizeNumber,
  setShowModalPrize,
}: ModalPrizeProps) {
  return (
    <div className='absolute flex justify-center items-center backdrop-blur-2xl h-full w-full z-20 flex-col'>
      <button
        onClick={() => setShowModalPrize(false)}
        className='absolute top-5 right-5 bg-white rounded-full w-16 h-16 p-1 cursor-pointer flex justify-center items-center'
      >
        <img src={CloseIcon} className='h-12' alt='Close Icon'></img>
      </button>
      <Fireworks />
      <p className='text-5xl font-bold text-white uppercase'>You won!</p>
      <div className='prize-container-animation'>
        <img
          src={findPrize(Object.keys(prizeNumber)[0])?.image.uri}
          alt='prize'
          className='prize-animation h-30'
        />
      </div>
    </div>
  );
}
