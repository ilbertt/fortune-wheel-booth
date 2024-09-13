import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import FortuneWheel from '../src/components/FortuneWheel';
import ModalPrize from '../src/components/ModalPrize';
import { findPrizeIndex } from '../src/utils/findPrize';
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

const PRIZE_MODAL_DURATION_MILLIS = 30_000;
const FETCH_EXTRACTION_INTERVAL_MILLIS = 2_000;

function FortuneWheelPage() {
  const [showModalPrize, setShowModalPrize] = useState(false);
  const [lastExtraction, setLastExtraction] =
    useState<[Principal, Extraction]>();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(-1);

  const onStopSpinning = useCallback(() => {
    setShowModalPrize(true);
    setMustSpin(false);

    setTimeout(() => {
      setShowModalPrize(false);
      setPrizeNumber(-1);
    }, PRIZE_MODAL_DURATION_MILLIS);
  }, []);

  const extractPrize = useCallback(async () => {
    const newExtraction = await ACTOR.getLastExtraction();
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
        setPrizeNumber(findPrizeIndex(newExtraction[0][1].prize));
        setMustSpin(true);
        setLastExtraction(newExtraction[0]);
      }
    }
  }, [mustSpin, lastExtraction]);

  useEffect(() => {
    const extractPrizeInterval = setInterval(extractPrize, FETCH_EXTRACTION_INTERVAL_MILLIS);
    return () => {
      clearInterval(extractPrizeInterval);
    };
  }, [extractPrize]);

  return (
    <main className='flex justify-center items-center flex-col relative h-full'>
      <div className='flex justify-center items-center absolute top-10 left-5 h-[3vw]'>
        <img className='h-full' src='/hub-logo-light.svg' alt='hub logo logo' />
      </div>
      <div className='flex justify-center items-center absolute top-10 right-5 h-64'>
        <img className='h-full' src='/qrcode-oisy.png' alt='Oisy.com qr code' />
      </div>
      <FortuneWheel
        onStopSpinning={onStopSpinning}
        prizeNumber={prizeNumber}
        mustSpin={mustSpin && prizeNumber > -1}
      />
      {showModalPrize && (
        <ModalPrize
          prizeNumber={prizeNumber}
          setShowModalPrize={setShowModalPrize}
          setMustSpin={setMustSpin}
        />
      )}
      <img
        className='absolute bottom-5 right-5 h-[4vw] z-20'
        src='/logo2.png'
        alt='DFINITY logo'
      />
    </main>
  );
}

export default FortuneWheelPage;
