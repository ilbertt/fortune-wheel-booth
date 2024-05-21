import Astronaut from "./assets/images/astronaut-loader.png";
import ckBtc from "./assets/images/ckbtc.png";
import ckEth from "./assets/images/cketh.png";
import IcpLogoLight from "./assets/images/icp-logo-light.png";
import { WheelDataType } from "react-custom-roulette";

export const PRIZES: WheelDataType[] = [
  {
    option: "ckEth0_01",
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#00155C" },
  },
  {
    option: "icp1",
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#005C00" },
  },
  {
    option: "ckEth0_05",
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#28ABE2" },
  },
  {
    option: "icp0_5",
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#F36526" },
  },
  {
    option: "ckBtc0_001",
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#564B9E" },
  },
  {
    option: "merchHat",
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#1EED3E" },
  },
  {
    option: "ckBtc0_005",
    image: { uri: ckBtc, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#ED1E78" },
  },
  {
    option: "merchTshirt",
    image: { uri: Astronaut, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#FFEC0C" },
  },
  {
    option: "ckEth0_01",
    image: { uri: ckEth, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#FBB03C" },
  },
  {
    option: "icp1",
    image: { uri: IcpLogoLight, sizeMultiplier: 0.7, offsetY: 220 },
    style: { backgroundColor: "#7B2582" },
  },
];

export const PRIZES_VALUES_MAPPING: Record<string, string> = {
  ckEth0_01: "0.01 ckETH",
  icp1: "1 ICP",
  ckEth0_05: "0.05 ckETH",
  icp0_5: "0.7 ICP",
  ckBtc0_001: "0.001 ckBTC",
  merchHat: "Hat",
  ckBtc0_005: "0.005 ckBTC",
  merchTshirt: "T-Shirt",
};
