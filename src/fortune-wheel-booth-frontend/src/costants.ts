import Duck from './assets/images/duck.png';
import Lemon from './assets/images/lemon.png';
import ckBtc from './assets/images/ckbtc.png';
import ckEth from './assets/images/cketh.png';
import IcpLogoLight from './assets/images/icp-logo-light.png';
import { CustomWheelData } from './types';

export const PRIZES: CustomWheelData[] = [
  {
    id: 0,
    option: 'ckEth0_001',
    image: { uri: ckEth, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#FBB03C' },
  },
  {
    id: 1,
    option: 'ckEth0_05',
    image: { uri: ckEth, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#28ABE2' },
  },
  {
    id: 2,
    option: 'icp1',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#7B2582' },
  },
  {
    id: 3,
    option: 'icp0_5',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#F36526' },
  },
  {
    id: 4,
    option: 'ckBtc0_001',
    image: { uri: ckBtc, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#564B9E' },
  },
  {
    id: 5,
    option: 'ckBtc0_005',
    image: { uri: ckBtc, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#ED1E78' },
  },
  {
    id: 6,
    option: 'merchHat',
    image: { uri: Duck, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#1EED3E' },
  },
  {
    id: 7,
    option: 'merchTshirt',
    image: { uri: Lemon, sizeMultiplier: 0.8, offsetY: 140 },
    style: { backgroundColor: '#FFEC0C' },
  },
];
