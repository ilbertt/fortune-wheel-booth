import { Wheel } from 'react-custom-roulette';
import { PRIZES } from '../constants';
import Logo from '../assets/images/fortune-wheel-logo.png';
import Pointer from '../assets/images/pointer.png';

interface FortuneWheelProps {
  onStopSpinning: () => void;
  prizeNumber: number;
  mustSpin: boolean;
}

export default function FortuneWheel({
  onStopSpinning,
  prizeNumber,
  mustSpin,
}: FortuneWheelProps) {
  return (
    <div className='wheel-container relative scale-125'>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={PRIZES}
        onStopSpinning={onStopSpinning}
        outerBorderWidth={3}
        outerBorderColor='white'
        radiusLineWidth={3}
        radiusLineColor='white'
        pointerProps={{
          src: Pointer,
          style: { transform: 'translate(-22%, 20%) rotate(250deg)' },
        }}
      />
      <img
        className='absolute bottom-2/4 left-0 right-0 top-2/4 z-10 h-[10vw] w-[10vw]'
        src={Logo}
        alt='fortune wheel logo'
      />
    </div>
  );
}
