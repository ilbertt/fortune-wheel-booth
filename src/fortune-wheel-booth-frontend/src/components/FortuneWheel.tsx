import { Dispatch, SetStateAction, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { PRIZES } from "../costants";
import IcpLogo from "../assets/images/icp-logo-dark.png";
import Pointer from "../assets/images/pointer.png";

interface FortuneWheelProps {
  setShowModalPrize: Dispatch<SetStateAction<boolean>>;
  prizeNumber: number;
}

export default function FortuneWheel({
  setShowModalPrize,
  prizeNumber,
}: FortuneWheelProps) {
  const [mustSpin, setMustSpin] = useState(false);

  const handleSpinClick = () => {
    if (!mustSpin) {
      setMustSpin(true);
    }
  };

  return (
    <div className="relative wheel-container">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={PRIZES}
        onStopSpinning={() => {
          setMustSpin(false);
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
      <button
        className="absolute z-10 bottom-2/4 -left-24 bg-white rounded-md px-3"
        onClick={handleSpinClick}
      >
        SPIN
      </button>
    </div>
  );
}
