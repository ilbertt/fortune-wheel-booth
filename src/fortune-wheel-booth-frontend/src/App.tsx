import { Scanner } from '@yudiel/react-qr-scanner';
import { useCallback, useEffect, useState } from 'react';
import { canisterId, createActor } from 'declarations/fortune-wheel-booth-backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { _SERVICE } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { type ActorSubclass, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminActor, setAdminActor] = useState<ActorSubclass<_SERVICE>>();
  const [adminPrincipal, setAdminPrincipal] = useState<Principal>();

  const setupIcState = useCallback((identity: Identity) => {
    const agent = new HttpAgent({ identity });
    const actor = createActor(
      canisterId,
      {
        agent,
      }
    );
    setAdminActor(actor);

    setAdminPrincipal(identity.getPrincipal());
  }, []);

  const handleLogin = useCallback(async () => {
    const authClient = await AuthClient.create();

    // start the login process and wait for it to finish
    await new Promise((resolve) => {
      authClient.login({
        identityProvider: process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app"
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
      }

      setIsAuthenticated(authenticated);
    })();
  }, [setupIcState]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isAuthenticated && (
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
      {isAuthenticated && (
        <>
          <Scanner
            onResult={(text, result) => console.log(text, result)}
            onError={(error) => console.log('Error', error?.message)}
          />
          <p className='absolute bottom-[15%] left-0 right-0 m-auto text-center text-white text-base'>
            Admin Principal:
            <br />
            <span>{adminPrincipal?.toText()}</span>
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
