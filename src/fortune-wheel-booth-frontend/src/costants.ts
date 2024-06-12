import Astronaut from './assets/images/astronaut-loader.png';
import ckBtc from './assets/images/ckbtc.png';
import ckEth from './assets/images/cketh.png';
import ckUsdc from './assets/images/ckusdc.svg';
import IcpLogoLight from './assets/images/icp-logo-light.png';
import jackpot from './assets/images/jackpot.svg';
import jackpotModal from './assets/images/jackpot-modal.png';
import nftFestLogo from './assets/images/nft-fest-logo.png';
import { WheelDataType } from 'react-custom-roulette';

type CustomWheelDataType = WheelDataType & {
  option: string;
  modalImageUri?: string;
};

export const PRIZES: CustomWheelDataType[] = [
  {
    option: 'merch.Hat',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
    modalImageUri: nftFestLogo,
  },
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FBB03B' },
  },
  {
    option: 'merch.Tshirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E79' },
    modalImageUri: nftFestLogo,
  },
  {
    option: 'merch.Ticket',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F15A24' },
    modalImageUri: nftFestLogo,
  },
  {
    option: 'merch.Hat',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#29ABE2' },
    modalImageUri: nftFestLogo,
  },
  {
    option: 'ckBtc',
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#FBB03B' },
  },
  {
    option: 'merch.Tshirt',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#ED1E79' },
    modalImageUri: nftFestLogo,
  },
  {
    option: 'merch.Ticket',
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: '#F15A24' },
    modalImageUri: nftFestLogo,
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string> = {
  ckBtc: '$1 in ckBTC',
  'merch.Tshirt': 'NFT fest T-shirt',
  'merch.Hat': 'NFT fest Hat',
  'merch.Ticket': 'NFT fest Ticket',
};
