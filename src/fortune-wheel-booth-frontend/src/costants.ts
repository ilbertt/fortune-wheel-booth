import Duck from '../public/images/duck.png';
import Lemon from '../public/images/lemon.png';
import Cash from '../public/images/cash.png';
import { CustomWheelData } from './types';

export const PRIZES: CustomWheelData[] = [
  {
    id: 0,
    option: 'ckEth0_01',
    image: { uri: Duck, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#FBB03C' },
  },
  {
    id: 1,
    option: 'ckEth0_05',
    image: { uri: Lemon, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#28ABE2' },
  },
  {
    id: 2,
    option: 'icp1',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#7B2582' },
  },
  {
    id: 3,
    option: 'icp0_5',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#F36526' },
  },
  {
    id: 4,
    option: 'ckBtc0_001',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#564B9E' },
  },
  {
    id: 5,
    option: 'ckBtc0_005',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#ED1E78' },
  },
  {
    id: 6,
    option: 'merchHat',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#1EED3E' },
  },
  {
    id: 7,
    option: 'merchTshirt',
    image: { uri: Cash, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#FFEC0C' },
  },
];
