import { PRIZES } from '../costants';

// TODO: Fix this
export const findPrize = (option: string) => {
  return (
    PRIZES.find((prize) => prize.option === option) || {
      id: 9999,
      option: 'lose',
      image: { uri: '/images/duck.png' },
      style: { backgroundColor: '#FBB03C' },
    }
  );
};
