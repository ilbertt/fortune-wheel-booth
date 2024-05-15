import { PRIZES } from '../costants';

// TODO: Fix this
export const findPrize = (option: string) => {
  return (
    PRIZES.find((prize) => prize.option === option) || {
      id: 9999,
      option: 'placeholder',
      image: { uri: '../../public/images/duck.png' },
      style: { backgroundColor: '#FBB03C' },
    }
  );
};
