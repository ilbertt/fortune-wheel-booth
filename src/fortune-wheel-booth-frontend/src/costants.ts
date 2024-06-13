import Astronaut from './assets/images/astronaut-loader.png';
import ckBtc from './assets/images/ckbtc.png';
import IcpLogoLight from './assets/images/icp-logo-light.png';
import jackpot from './assets/images/jackpot.svg';
import jackpotModal from './assets/images/jackpot-modal.png';
import { WheelDataType } from 'react-custom-roulette';

type CustomWheelDataType = WheelDataType & {
  option: string;
  modalImageUri?: string;
};

export const PRIZES: CustomWheelDataType[] = [
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#522785' },
  },
  {
    option: 'merch.Pen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
  },
  {
    option: 'icp',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FBB03B' },
  },
  {
    option: 'special.jackpot',
    image: { uri: jackpot, sizeMultiplier: 1.3, offsetY: 140 },
    style: { backgroundColor: '#F15A24' },
    modalImageUri: jackpotModal,
  },
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#522785' },
  },
  {
    option: 'merch.Pen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
  },
  {
    option: 'icp',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FBB03B' },
  },
  {
    option: 'merch.Pen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F15A24' },
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string> = {
  icp: '$1 in ICP',
  ckBtc: '$1 in ckBTC',
  'merch.Pen': 'ICP Pen',
  'special.jackpot': 'JACKPOT',
};
