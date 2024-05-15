import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { createActor } from 'declarations/internet-identity/index';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);

  const handleLogin = async () => {
    let authClient = await AuthClient.create();

    // start the login process and wait for it to finish
    await new Promise((resolve) => {
      authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: resolve,
      });
    });

    // At this point we're authenticated, and we can get the identity from the auth client:
    const identity = authClient.getIdentity();
    // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
    const agent = new HttpAgent({ identity });
    // Using the interface description of our webapp, we create an actor that we use to call the service methods.
    const actor = createActor(
      process.env.CANISTER_ID_FORTUNE_WHEEL_BOOTH_BACKEND as string,
      {
        agent,
      }
    );

    return false;
  };
  return (
    <>
      {!showScanner && (
        <div className='flex justify-center items-center h-full w-full flex-col gap-4'>
          <img
            className='absolute top-10 left-0 right-0 m-auto h-32 z-20'
            src='/images/icp-logo.png'
            alt='icp logo'
          />
          <button
            className='bg-white rounded-xl shadow-sm w-44 text-center px-4 py-2'
            onClick={() => handleLogin()}
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
      {showScanner && (
        <>
          <Scanner
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log('Error', error?.message)}
          />
          <p className='absolute bottom-[15%] left-0 right-0 m-auto text-center text-white text-base'>
            Admin Principal: <br />
            <span>0123456789</span>
          </p>
        </>
      )}
      <img
        className='absolute bottom-1 left-0 right-0 m-auto h-20 z-20'
        src='/logo2.svg'
        alt='DFINITY logo'
      />
    </>
  );
}
