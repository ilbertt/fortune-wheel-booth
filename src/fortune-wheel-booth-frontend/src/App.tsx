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
      <div className='flex justify-center items-center h-full w-full text-center text-white'>
        Loading...
      </div>
    );
  }

  return (
    <>
      {isAnonymous && (
        <div className='flex justify-center items-center h-full w-full flex-col gap-4'>
          <img
            className='absolute top-10 left-0 right-0 m-auto h-32 z-20'
            src={icpItChLogo}
            alt='icpItCh logo'
          />
          {canisterErrorResponse && (
            <p className='text-red-500 text-sm absolute top-1/4 left-0 right-0 m-auto text-center'>
              {canisterErrorResponse}
            </p>
          )}
          <button
            className='bg-white rounded-xl shadow-sm w-44 text-center px-4 py-2'
            onClick={handleLogin}
          >
            <p className='text-xl'>Admin</p>
          </button>
          <a
            className='bg-white rounded-xl shadow-sm w-44 text-center px-4 py-2 text-xl'
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
          <div className='w-full flex justify-center items-center pt-4'>
            <button
              className='bg-white rounded-xl shadow-sm w-24 p-1 px-0 mx-auto'
              onClick={logout}
            >
              <p className='text-center text-base'>Logout</p>
            </button>
          </div>
          <div className='absolute bottom-[15%] left-0 right-0 m-auto flex justify-center items-center flex-col gap-4'>
            <p className='text-center text-white text-base px-16 gap-2 font-bold'>
              Admin Principal:
              <br />
              <span className='font-normal text-xs'>
                {adminPrincipal.toText()}
              </span>
            </p>
            <button
              className='bg-white rounded-xl shadow-sm w-32 p-1'
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
        className='absolute bottom-0 left-0 right-0 m-auto h-32 w-36 z-20'
        src={icpMainLogo}
        alt='icp main logo'
      />
    </>
  );
}
