import Duck from '../public/images/duck.png';
import Lemon from '../public/images/lemon.png';
import Cash from '../public/images/cash.png';

export const PRIZES = [
  {
    id: 0,
    option: 'icp1',
    image: { uri: Duck },
    style: { backgroundColor: '#FBB03C' },
  },
  {
    id: 1,
    option: 'ckEth0_01',
    image: { uri: Lemon },
    style: { backgroundColor: '#28ABE2' },
  },
  {
    id: 2,
    option: 'merchTshirt',
    image: { uri: Cash },
    style: { backgroundColor: '#7B2582' },
  },
];

// { 'ckEth0_01' : bigint } |
//   { 'ckEth0_05' : bigint } |
//   { 'icp1' : bigint } |
//   { 'icp0_5' : bigint } |
//   { 'ckBtc0_001' : bigint } |
//   { 'ckBtc0_005' : bigint } |
//   { 'merchHat' : null } |
//   { 'merchTshirt' : null };
