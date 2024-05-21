import { PRIZES } from '../costants';

export const findPrize = (option: string) => {
  const prize = PRIZES.find((prize, index) => prize.option === option);
  return prize ? PRIZES.indexOf(prize) : 99; // TODO: Fix this, 99 represents "no prize exists for this option"
};
