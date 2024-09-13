import { type Prize } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { PRIZES } from '../constants';

const prizesIndexesForOption = (option: string) => {
  const indexes: number[] = PRIZES.reduce((acc: number[], prize, index) => {
    if (prize?.option === option) {
      acc.push(index);
    }
    return acc;
  }, []);

  return indexes;
};

export const getPrizeWheelOption = (prize: Prize): string => {
  let option = Object.keys(prize)[0];
  if ('merch' in prize || 'special' in prize) {
    const subOption = Object.entries(prize)[0][1];
    if (subOption) {
      option = `${option}.${subOption}`;
    }
  }
  return option;
};

export const findPrizeIndex = (prize: Prize): number => {
  const option = getPrizeWheelOption(prize);

  const prizesIndexes: number[] = prizesIndexesForOption(option);
  if (prizesIndexes.length === 0) {
    return -1;
  }
  if (prizesIndexes.length === 1) {
    return prizesIndexes[0];
  }

  return prizesIndexes[Math.floor(Math.random() * prizesIndexes.length)];
};
