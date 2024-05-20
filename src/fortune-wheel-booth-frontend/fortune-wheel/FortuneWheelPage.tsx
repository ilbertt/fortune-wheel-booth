import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import FortuneWheel from '../src/components/FortuneWheel';
import ModalPrize from '../src/components/ModalPrize';
import { findPrize } from '../src/utils/findPrize';
import { Principal } from '@dfinity/principal';
import { type ActorSubclass } from '@dfinity/agent';
import {
  _SERVICE,
  Extraction,
} from '../../declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import {
  canisterId,
  createActor,
} from '../../declarations/fortune-wheel-booth-backend';

function FortuneWheelPage() {
  const [showModalPrize, setShowModalPrize] = useState(false);
  const [lastExtraction, setLastExtraction] =
    useState<[Principal, Extraction]>();
  const [mustSpin, setMustSpin] = useState(false);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();
  const [prizeNumber, setPrizeNumber] = useState<number>(0);

  useEffect(() => {
    if (showModalPrize)
      setTimeout(() => {
        setShowModalPrize(false);
        setMustSpin(false);
      }, 8000);
  }, [showModalPrize]);

  useEffect(() => {
    const actor = createActor(canisterId);
    setActor(actor);
  }, []);

  useEffect(() => {
    const extractPrizeInterval = setInterval(extractPrize, 2000);
    return () => {
      clearInterval(extractPrizeInterval);
    };
  }, [actor, mustSpin, lastExtraction]);

  const extractPrize = useCallback(async () => {
    const _lastExtraction = await actor?.getLastExtraction();
    if (
      !mustSpin &&
      _lastExtraction &&
      _lastExtraction[0] &&
      _lastExtraction.length > 0
    ) {
      const lastExtractedPrincipal = _lastExtraction[0][0];
      if (
        lastExtraction &&
        'eq' !== lastExtractedPrincipal.compareTo(lastExtraction[0])
      ) {
        setMustSpin(true);
        setLastExtraction(_lastExtraction[0]);
      } else if (!lastExtraction) {
        //  first extraction of the cycle
        setLastExtraction(_lastExtraction[0]);
        setMustSpin(true);
      }
    }
  }, [actor, mustSpin, lastExtraction]);

  useEffect(() => {
    if (lastExtraction) {
      setPrizeNumber(findPrize(Object.keys(lastExtraction[1].prize)[0]));
    }
  }, [lastExtraction]);

  return (
    <main className='flex justify-center items-center flex-col relative h-full'>
      {/* TODO: Put the ICPhubIt logo */}
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
        src='/logo2.svg'
        alt='DFINITY logo'
      />
    </main>
  );
}

export default FortuneWheelPage;
