import { WheelDataType } from 'react-custom-roulette';

// PRIZES
import arrosticiniFornacella from './assets/images/prizes/arrosticini-fornacella.png';
import bitomatCoupon from './assets/images/prizes/bitomat-coupon.png';
import ledgerWallet from './assets/images/prizes/ledger-wallet.png';
import caramelleFiori from './assets/images/prizes/caramelle-fiori.png';
import brickVino from './assets/images/prizes/brick-vino.png';
import blockchainBeachTicket from './assets/images/prizes/blockchain-beach-ticket.png';
import magliettaSfLibroSfPennaSf from './assets/images/prizes/maglietta-sf-libro-sf-penna-sf.png';

// MODAL PRIZES
import modal_arrosticini from './assets/images/modals/arrosticini.png';
import modal_fornacella from './assets/images/modals/fornacella.png';
import modal_bitomatCoupon from './assets/images/modals/bitomat-coupon.png';
import modal_ledgerWallet from './assets/images/modals/ledger-wallet.png';
import modal_caramelle from './assets/images/modals/caramelle.png';
import modal_fiori from './assets/images/modals/fiori.png';
import modal_brickVino from './assets/images/modals/brick-vino.png';
import modal_blockchainBeachTicket from './assets/images/modals/blockchain-beach-ticket.png';
import modal_magliettaSf from './assets/images/modals/maglietta-sf.png';
import modal_libroSf from './assets/images/modals/libro-sf.png';
import modal_pennaSf from './assets/images/modals/penna-sf.png';

// default prizes
import noPrize from './assets/images/prizes/no-prize.png';
import modal_noPrize from './assets/images/modals/no-prize.png';
const NO_PRIZE = 'noPrize';

const BLUE_COLOR = '#216AB2';
const LIGHT_BLUE_COLOR = '#36BEDE';

type CustomWheelDataType = WheelDataType & {
  option: string;
  modalImageUri?: string;
  hideModalImage?: boolean;
};

export const PRIZES: CustomWheelDataType[] = [
  {
    option: 'merch.arrosticini',
    image: { uri: arrosticiniFornacella, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_arrosticini,
  },
  {
    option: 'merch.bitomat-coupon',
    image: { uri: bitomatCoupon, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_bitomatCoupon,
  },
  {
    option: 'merch.libro-sf',
    image: {
      uri: magliettaSfLibroSfPennaSf,
      sizeMultiplier: 0.6,
      offsetY: 220,
    },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_libroSf,
  },
  {
    option: 'merch.ledger-wallet',
    image: { uri: ledgerWallet, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_ledgerWallet,
  },
  {
    option: 'merch.caramelle',
    image: { uri: caramelleFiori, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_caramelle,
  },
  {
    option: 'merch.brick-vino',
    image: { uri: brickVino, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_brickVino,
  },
  {
    option: 'merch.maglietta-sf',
    image: {
      uri: magliettaSfLibroSfPennaSf,
      sizeMultiplier: 0.6,
      offsetY: 220,
    },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_magliettaSf,
  },
  {
    option: 'merch.fornacella',
    image: { uri: arrosticiniFornacella, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_fornacella,
  },
  {
    option: 'merch.blockchain-beach-ticket',
    image: { uri: blockchainBeachTicket, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_blockchainBeachTicket,
  },
  {
    option: 'merch.fiori',
    image: { uri: caramelleFiori, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_fiori,
  },
  {
    option: 'merch.penna-sf',
    image: {
      uri: magliettaSfLibroSfPennaSf,
      sizeMultiplier: 0.6,
      offsetY: 220,
    },
    style: { backgroundColor: BLUE_COLOR },
    modalImageUri: modal_pennaSf,
  },
  {
    option: NO_PRIZE,
    image: { uri: noPrize, sizeMultiplier: 0.6, offsetY: 220 },
    style: { backgroundColor: LIGHT_BLUE_COLOR },
    modalImageUri: modal_noPrize,
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string | null> = {};
