import { PRIZES } from '../costants';

export const findPrize = (option: string) => {
  if (option === 'merch') {
    const merchNumbers = [1, 2, 3, 4, 5, 6];
    option =
      'merch' + merchNumbers[Math.floor(Math.random() * merchNumbers.length)];
  }
  const prizeIndex = PRIZES.findIndex((prize) => prize.option === option);
  return prizeIndex ?? 99; // TODO: Fix this, 99 represents "no prize exists for this option"
};
