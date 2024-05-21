import { useEffect, useState } from "react";
import FortuneWheel from "./components/FortuneWheel";
import ModalPrize from "./components/ModalPrize";
import { type Prize } from "declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did";
import { findPrize } from "./utils/findPrize";

const mockCanisterResponse: Prize = {
  icp1: 10n,
}; // TODO: Implement real canister response

function App() {
  const [showModalPrize, setShowModalPrize] = useState(false);

  useEffect(() => {
    if (showModalPrize) setTimeout(() => setShowModalPrize(false), 8000);
  }, [showModalPrize]);

  return (
    <main className="flex justify-center items-center flex-col relative h-full">
      <div className="flex justify-center items-center absolute top-10 left-5 h-[3vw]">
        <img
          className="h-full"
          src="src/assets/hub-logo-light.svg"
          alt="hub logo logo"
        />
      </div>
      <FortuneWheel
        setShowModalPrize={setShowModalPrize}
        prizeNumber={findPrize(Object.keys(mockCanisterResponse)[0])}
      />
      {showModalPrize && (
        <ModalPrize
          prizeNumber={mockCanisterResponse}
          setShowModalPrize={setShowModalPrize}
        />
      )}
      <img
        className="absolute bottom-5 right-5 h-[4vw]"
        src="/logo2.svg"
        alt="DFINITY logo"
      />
    </main>
  );
}

export default App;
