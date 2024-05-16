import { Scanner } from '@yudiel/react-qr-scanner';
import { useCallback, useEffect, useState } from 'react';
import {
  canisterId,
  createActor,
} from 'declarations/fortune-wheel-booth-backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { _SERVICE } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { type ActorSubclass, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export default function Home() {
  const [adminActor, setAdminActor] = useState<ActorSubclass<_SERVICE>>();
  const [adminPrincipal, setAdminPrincipal] = useState<Principal>();

  const setupIcState = useCallback((identity: Identity) => {
    const agent = new HttpAgent({ identity });
    const actor = createActor(canisterId, {
      agent,
    });
    setAdminActor(actor);

    setAdminPrincipal(identity.getPrincipal());
  }, []);

  const resetIcState = useCallback(() => {
    setAdminActor(undefined);
    setAdminPrincipal(Principal.anonymous());
  }, []);

  const handleLogin = useCallback(async () => {
    const authClient = await AuthClient.create();

    // start the login process and wait for it to finish
    await new Promise((resolve) => {
      authClient.login({
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app'
            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/`,
        onSuccess: resolve,
      });
    });

    const identity = authClient.getIdentity();
    setupIcState(identity);
  }, [setupIcState]);

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();

      const authenticated = await authClient.isAuthenticated();
      if (authenticated) {
        setupIcState(authClient.getIdentity());
      } else {
        resetIcState();
      }
    })();
  }, [setupIcState, resetIcState]);

  const logout = useCallback(async () => {
    if (adminActor) {
      await (await AuthClient.create()).logout();
      resetIcState();
    }
  }, [adminActor, resetIcState]);

  if (!adminPrincipal) {
    return <div>Loading...</div>;
  }

  const isAnonymous = adminPrincipal.isAnonymous();

  return (
    <>
      {isAnonymous && (
        <div className='flex justify-center items-center h-full w-full flex-col gap-4'>
          <img
            className='absolute top-10 left-0 right-0 m-auto h-32 z-20'
            src='/images/icp-logo.png'
            alt='icp logo'
          />
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
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log('Error', error?.message)}
          />
          <div className='w-full flex justify-center items-center'>
            <button
              className='bg-white rounded-xl shadow-sm w-24 p-1 px-0 mx-auto'
              onClick={logout}
            >
              <p className='text-center text-base'>Logout</p>
            </button>
          </div>
          <div className='absolute bottom-[15%] left-0 right-0 m-auto flex justify-center items-center flex-col gap-4'>
            <p className='text-center text-white text-base px-20 gap-2 font-bold'>
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
        className='absolute bottom-0 left-0 right-0 m-auto h-20 z-20'
        src='/logo2.svg'
        alt='DFINITY logo'
      />
    </>
  );
}
