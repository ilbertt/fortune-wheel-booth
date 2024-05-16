import { Prize } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { Dispatch, SetStateAction } from 'react';
import { WheelDataType } from 'react-custom-roulette';

export interface ModalPrizeProps {
  prizeNumber: Prize;
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
}

export interface FortuneWheelProps {
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  prizeNumber: number;
}
