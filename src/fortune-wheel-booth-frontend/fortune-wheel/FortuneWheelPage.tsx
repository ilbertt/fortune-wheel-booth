import React, { useEffect, useState } from 'react';
import FortuneWheel from '../src/components/FortuneWheel';
import ModalPrize from '../src/components/ModalPrize';
import { type Prize } from '../../declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { findPrize } from '../src/utils/findPrize';

const mockCanisterResponse: Prize = {
  icp1: 10n,
}; // TODO: Implement real canister response

function FortuneWheelPage() {
  const [showModalPrize, setShowModalPrize] = useState(false);

  useEffect(() => {
    if (showModalPrize) setTimeout(() => setShowModalPrize(false), 8000);
  }, [showModalPrize]);

  return (
    <main className='flex justify-center items-center flex-col relative h-full'>
      <FortuneWheel
        setShowModalPrize={setShowModalPrize}
        prizeNumber={findPrize(Object.keys(mockCanisterResponse)[0])?.id}
      />
      {showModalPrize && (
        <ModalPrize
          prizeNumber={mockCanisterResponse}
          setShowModalPrize={setShowModalPrize}
        />
      )}
      <img
        className='absolute bottom-5 left-5 h-20 z-20'
        src='/logo2.svg'
        alt='DFINITY logo'
      />
    </main>
  );
}

export default FortuneWheelPage;
