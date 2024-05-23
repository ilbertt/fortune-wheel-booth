import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import { _SERVICE } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { Principal } from '@dfinity/principal';
import icpItChLogo from './assets/hub-logo-light.svg';
import icpMainLogo from './assets/icp-main-logo.svg';
import useIcState from './hooks/useIcState';

export default function Home() {
  const { isAnonymous, logout, handleLogin, adminActor, adminPrincipal } =
    useIcState();
  const [canisterErrorResponse, setCanisterErrorResponse] = useState<string>();
  const [prizeExtracted, setPrizeExtracted] = useState<boolean>(false);

  useEffect(() => {
    setInterval(() => {
      if (prizeExtracted) setPrizeExtracted(false);
    }, 10000);
  }, [prizeExtracted]);

  const extractPrize = async (text: string) => {
    if (prizeExtracted) return;
    setPrizeExtracted(true);
    const userPrincipal: Principal = Principal.fromText(text);
    if (adminActor) {
      try {
        const extraction = await adminActor.extract(userPrincipal);
        console.log(extraction);
      } catch (error: any) {
        console.log(error);
        if (error.message.includes('Only admins can extract')) {
          logout();
          setCanisterErrorResponse('Only admins can extract');
        }
      }
    }
  };

  if (!adminPrincipal) {
    return (
      <div className='flex h-full w-full items-center justify-center text-center text-white'>
        Loading...
      </div>
    );
  }

  return (
    <>
      {isAnonymous && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
          <img
            className='absolute left-0 right-0 top-10 z-20 m-auto h-32'
            src={icpItChLogo}
            alt='icpItCh logo'
          />
          {canisterErrorResponse && (
            <p className='absolute left-0 right-0 top-1/4 m-auto text-center text-sm text-red-500'>
              {canisterErrorResponse}
            </p>
          )}
          <button
            className='w-44 rounded-xl bg-white px-4 py-2 text-center shadow-sm'
            onClick={handleLogin}
          >
            <p className='text-xl'>Admin</p>
          </button>
          <a
            className='w-44 rounded-xl bg-white px-4 py-2 text-center text-xl shadow-sm'
            href='/fortune-wheel/'
          >
            Fortune Wheel
          </a>
        </div>
      )}
      {!isAnonymous && (
        <>
          <Scanner
            onResult={(text) => extractPrize(text)}
            onError={(error) => console.log('Error', error?.message)}
          />
          <div className='flex w-full items-center justify-center pt-4'>
            <button
              className='mx-auto w-24 rounded-xl bg-white p-1 px-0 shadow-sm'
              onClick={logout}
            >
              <p className='text-center text-base'>Logout</p>
            </button>
          </div>
          <div className='absolute bottom-[15%] left-0 right-0 m-auto flex flex-col items-center justify-center gap-4'>
            <p className='gap-2 px-16 text-center text-base font-bold text-white'>
              Admin Principal:
              <br />
              <span className='text-xs font-normal'>
                {adminPrincipal.toText()}
              </span>
            </p>
            <button
              className='w-32 rounded-xl bg-white p-1 shadow-sm'
              onClick={() =>
                navigator.clipboard.writeText(adminPrincipal.toText())
              }
            >
              <p className='text-center text-sm'>Copy Principal</p>
            </button>
          </div>
        </>
      )}
      <img
        className='absolute bottom-0 left-0 right-0 z-20 m-auto h-32 w-36'
        src={icpMainLogo}
        alt='icp main logo'
      />
    </>
  );
}
