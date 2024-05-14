import { Dispatch, SetStateAction, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { PRIZES } from '../costants';
import IcpLogo from '../../public/images/icp-logo.png';

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
    <div className='relative'>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={PRIZES}
        onStopSpinning={() => {
          setMustSpin(false);
          setShowModalPrize(true);
        }}
        outerBorderWidth={0}
        // perpendicularText={false}
        pointerProps={{ style: { color: 'white' } }}
      />
      <img
        className='absolute z-10 h-28 left-0 right-0 top-2/4 bottom-2/4'
        src={IcpLogo}
        alt=''
      />
      <button
        className='absolute z-10 bottom-2/4 -left-24 bg-white rounded-md px-3'
        onClick={handleSpinClick}
      >
        SPIN
      </button>
    </div>
  );
}
