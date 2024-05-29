import { PRIZES } from '../costants';

const getMerchPrizesIndexes = () => {
  const merchPrizes: number[] = PRIZES.reduce((acc: number[], prize, index) => {
    if (prize?.option?.includes('merch')) {
      acc.push(index);
    }
    return acc;
  }, []);

  return merchPrizes;
};

export const findPrizeIndex = (option: string): number => {
  if (option === 'merch') {
    const merchPrizesIndexes: number[] = getMerchPrizesIndexes();
    return merchPrizesIndexes[
      Math.floor(Math.random() * merchPrizesIndexes.length)
    ];
  }
  return PRIZES.findIndex((prize) => prize.option === option); // Returns the index of the first element in the array where predicate is true, and -1 otherwise.
};
