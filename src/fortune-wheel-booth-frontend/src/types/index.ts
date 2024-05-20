import { Prize } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { Dispatch, SetStateAction } from 'react';

export interface ModalPrizeProps {
  prizeNumber: Prize;
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  setMustSpin: Dispatch<SetStateAction<boolean>>;
}

export interface FortuneWheelProps {
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  prizeNumber: number;
  mustSpin: boolean;
}
