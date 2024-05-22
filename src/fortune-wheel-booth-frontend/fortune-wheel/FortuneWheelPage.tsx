import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import FortuneWheel from '../src/components/FortuneWheel';
import ModalPrize from '../src/components/ModalPrize';
import { findPrize } from '../src/utils/findPrize';
import { Principal } from '@dfinity/principal';
import {
  _SERVICE,
  Extraction,
} from '../../declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import {
  canisterId,
  createActor,
} from '../../declarations/fortune-wheel-booth-backend';

const ACTOR = createActor(canisterId);

function FortuneWheelPage() {
  const [showModalPrize, setShowModalPrize] = useState(false);
  const [lastExtraction, setLastExtraction] =
    useState<[Principal, Extraction]>();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);

  useEffect(() => {
    if (showModalPrize)
      setTimeout(() => {
        setShowModalPrize(false);
        setMustSpin(false);
      }, 8000);
  }, [showModalPrize]);

  useEffect(() => {
    const extractPrizeInterval = setInterval(extractPrize, 2000);
    return () => {
      clearInterval(extractPrizeInterval);
    };
  }, [mustSpin, lastExtraction]);

  const extractPrize = useCallback(async () => {
    const newExtraction = await ACTOR?.getLastExtraction();
    if (
      !mustSpin &&
      newExtraction &&
      newExtraction.length > 0 &&
      newExtraction[0]
    ) {
      const lastExtractedPrincipal = newExtraction[0][0];
      if (
        !lastExtraction ||
        (lastExtraction &&
          'eq' !== lastExtractedPrincipal.compareTo(lastExtraction[0]))
      ) {
        setMustSpin(true);
        setLastExtraction(newExtraction[0]);
        setPrizeNumber(findPrize(Object.keys(newExtraction[0][1].prize)[0]));
      }
    }
  }, [mustSpin, lastExtraction]);

  return (
    <main className='flex justify-center items-center flex-col relative h-full'>
      <div className="flex justify-center items-center absolute top-10 left-5 h-[3vw]">
        <img
          className="h-full"
          src="src/assets/hub-logo-light.svg"
          alt="hub logo logo"
        />
      </div>
      <FortuneWheel
        setShowModalPrize={setShowModalPrize}
        prizeNumber={prizeNumber}
        mustSpin={mustSpin}
      />
      {showModalPrize && (
          <ModalPrize
            prizeNumber={prizeNumber}
            setShowModalPrize={setShowModalPrize}
            setMustSpin={setMustSpin}
          />
      )}
      <img
        className='absolute bottom-5 left-5 h-[4vw] z-20'
        src='/logo2.png'
        alt='DFINITY logo'
      />
    </main>
  );
}

export default FortuneWheelPage;
