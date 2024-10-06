import { WheelDataType } from 'react-custom-roulette';

// PRIZES
import merchTshirtPen from './assets/images/prizes/merch-tshirt-pen.png';
import ckBtc from './assets/images/prizes/ckbtc.png';
import ckEth from './assets/images/prizes/cketh.png';
import ckUsdc from './assets/images/prizes/ckusdc.svg';
import icp from './assets/images/prizes/icp.png';
import jackpot from './assets/images/prizes/jackpot.svg';

// --- MODALS ---
import modal_jackpot from './assets/images/modals/jackpot.png';
import modal_merchTshirt from './assets/images/modals/merch-tshirt.png';

// --- DEFAULT PRIZES ---
// (uncomment if needed)
// import noPrize from './assets/images/prizes/no-prize.png';
// import modal_noPrize from './assets/images/modals/no-prize.png';
// const NO_PRIZE = 'noPrize';

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
    image: { uri: merchTshirtPen, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#522785' },
    modalImageUri: modal_merchTshirt,
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
    modalImageUri: modal_jackpot,
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
    image: { uri: icp, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E79' },
  },
  {
    option: 'merch.pen',
    image: { uri: merchTshirtPen, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F15A24' },
    hideModalImage: true,
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
