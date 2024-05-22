import { Wheel } from 'react-custom-roulette';
import { PRIZES } from '../costants';
import IcpLogo from '../assets/images/icp-logo-dark.png';
import Pointer from '../assets/images/pointer.png';
import { Dispatch, SetStateAction } from 'react';

interface FortuneWheelProps {
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  prizeNumber: number;
  mustSpin: boolean;
}

export default function FortuneWheel({
  setShowModalPrize,
  prizeNumber,
  mustSpin,
}: FortuneWheelProps) {
  return (
    <div className="relative wheel-container">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={PRIZES}
        onStopSpinning={() => {
          setShowModalPrize(true);
        }}
        outerBorderWidth={0}
        pointerProps={{
          src: Pointer,
          style: { transform: "translate(-22%, 20%) rotate(250deg)" },
        }}
      />
      <img
        className="absolute z-10 h-[10vw] w-[10vw] left-0 right-0 top-2/4 bottom-2/4"
        src={IcpLogo}
        alt="icp logo"
      />
    </div>
  );
}
