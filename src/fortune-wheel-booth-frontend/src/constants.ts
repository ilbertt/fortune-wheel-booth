import { WheelDataType } from 'react-custom-roulette';

import Astronaut from './assets/images/astronaut-loader.png';
import ckBtc from './assets/images/ckbtc.png';
import ckEth from './assets/images/cketh.png';
import ckUsdc from './assets/images/ckusdc.svg';
import IcpLogoLight from './assets/images/icp-logo-light.png';
import jackpot from './assets/images/jackpot.svg';
import jackpotModal from './assets/images/jackpot-modal.png';
import marchTshirt from './assets/images/merch-tshirt.png';

type CustomWheelDataType = WheelDataType & {
  option: string;
  modalImageUri?: string;
  hideModalImage?: boolean;
};

export const PRIZES: CustomWheelDataType[] = [
  {
    option: 'ckEth',
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
  },
  {
    option: 'merch.tShirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#522785' },
    modalImageUri: marchTshirt,
  },
  {
    option: 'ckUsdc',
    image: { uri: ckUsdc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E79' },
  },
  {
    option: 'special.jackpot',
    image: { uri: jackpot, sizeMultiplier: 1.3, offsetY: 140 },
    style: { backgroundColor: '#F15A24' },
    modalImageUri: jackpotModal,
  },
  {
    option: 'ckEth',
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
  },
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#522785' },
  },
  {
    option: 'icp',
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E79' },
  },
  {
    option: 'merch.pen',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F15A24' },
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string | null> = {
  ckEth: '$1 in ckETH',
  icp: '$1 in ICP',
  ckBtc: '$1 in ckBTC',
  ckUsdc: '1 ckUSDC',
  'merch.tShirt': null,
  'merch.pen': 'ICP Pen',
  'special.jackpot': null,
};
