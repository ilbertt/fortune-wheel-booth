import Fireworks from "./Fireworks";
import CloseIcon from "../assets/close.svg";
import { PRIZES, PRIZES_VALUES_MAPPING } from "../costants";
import { Dispatch, SetStateAction, useMemo } from "react";

interface ModalPrizeProps {
  prizeNumber: number;
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  setMustSpin: Dispatch<SetStateAction<boolean>>;
}

export default function ModalPrize({
  prizeNumber,
  setShowModalPrize,
  setMustSpin,
}: ModalPrizeProps) {
  const wonPrize = useMemo(() => PRIZES[prizeNumber], [prizeNumber]);
  const wonPrizeValue = useMemo(
    () =>
      PRIZES_VALUES_MAPPING[
        wonPrize.option as keyof typeof PRIZES_VALUES_MAPPING
      ],
    [wonPrize]
  );

  return (
    <div className="absolute flex justify-center items-center backdrop-blur-2xl h-full w-full z-20 flex-col">
      <button
        onClick={() => {
          setShowModalPrize(false);
          setMustSpin(false);
        }}
        className='absolute top-5 right-5 bg-white rounded-full p-1 cursor-pointer flex justify-center items-center'
      >
        <img src={CloseIcon} className="h-[3vw]" alt="Close Icon"></img>
      </button>
      <Fireworks />
      <div className="flex flex-col justify-center items-center gap-4">
        <p className="text-[6vw] font-bold text-white uppercase">You won!</p>
        <div className="prize-container-animation">
          <img
            src={wonPrize.image?.uri}
            alt="prize"
            className="prize-animation h-30"
          />
        </div>
        <p className="text-[3vw] font-bold text-white uppercase prize-value-animation bg-dfinity-gradient-dark rounded-2xl p-2 px-4">
          {wonPrizeValue}
        </p>
      </div>
    </div>
  );
}
