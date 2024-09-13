import { Principal } from '@dfinity/principal';
import React, { useCallback, useEffect, useState } from 'react';

import {
  canisterId,
  createActor,
} from 'declarations/fortune-wheel-booth-backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { _SERVICE } from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { type ActorSubclass, Identity } from '@dfinity/agent';

export default function useIcState() {
  const [adminActor, setAdminActor] = useState<ActorSubclass<_SERVICE>>();
  const [adminPrincipal, setAdminPrincipal] = useState<Principal>();
  const [authClient, setAuthClient] = useState<AuthClient>();

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
    if (!authClient) return;
    // start the login process and wait for it to finish
    await new Promise((resolve) => {
      authClient.login({
        maxTimeToLive: BigInt(86_400_000_000_000),
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app'
            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/`,
        onSuccess: resolve,
      });
    });

    const identity = authClient.getIdentity();
    setupIcState(identity);
  }, [setupIcState, authClient]);

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

  useEffect(() => {
    (async () => {
      const ac = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });
      setAuthClient(ac);
    })();
  }, []);

  const logout = useCallback(async () => {
    if (adminActor) {
      await (await AuthClient.create()).logout();
      resetIcState();
    }
  }, [adminActor, resetIcState]);

  const isAnonymous = adminPrincipal && adminPrincipal.isAnonymous();

  return { isAnonymous, logout, handleLogin, adminActor, adminPrincipal };
}
