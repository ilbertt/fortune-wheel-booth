import Astronaut from './assets/images/astronaut-loader.png';
import ckBtc from './assets/images/ckbtc.png';
import ckEth from './assets/images/cketh.png';
import ckUsdc from './assets/images/ckusdc.svg';
import IcpLogoLight from './assets/images/icp-logo-light.png';
import jackpot from './assets/images/jackpot.svg';
import jackpotModal from './assets/images/jackpot-modal.png';
import merchTshirt from './assets/images/merch-tshirt.png';
import { WheelDataType } from 'react-custom-roulette';

type CustomWheelDataType = WheelDataType & {
  modalImageUri?: string;
};

export const PRIZES: CustomWheelDataType[] = [
  {
    option: 'ckEth',
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#00155C' },
  },
  {
    option: 'merchTshirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#28ABE2' },
    modalImageUri: merchTshirt,
  },
  {
    option: 'ckUsdc',
    image: { uri: ckUsdc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F36526' },
  },
  {
    option: 'merchPen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#1EED3E' },
  },
  {
    option: 'icp',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E78' },
  },
  {
    option: 'merchTshirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#005C00' },
    modalImageUri: merchTshirt,
  },
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#564B9E' },
  },
  {
    option: 'merchPen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FFEC0C' },
  },
  {
    option: 'jackpot',
    image: { uri: jackpot, sizeMultiplier: 1.3, offsetY: 140 },
    style: { backgroundColor: '#7B2582' },
    modalImageUri: jackpotModal,
  },
  {
    option: 'merchTshirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FBB03C' },
    modalImageUri: merchTshirt,
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string> = {
  ckEth: '0.00026 ckETH',
  icp: '0.082 ICP',
  ckBtc: '0.000015 ckBTC',
  ckUsdc: '1 ckUSDC',
  merchTshirt: 'ICP T-shirt',
  merchPen: 'ICP Pen',
  jackpot: 'Jackpot',
};
