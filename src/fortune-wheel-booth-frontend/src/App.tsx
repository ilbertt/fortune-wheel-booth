import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import {
  Extraction,
  _SERVICE,
} from 'declarations/fortune-wheel-booth-backend/fortune-wheel-booth-backend.did';
import { Principal } from '@dfinity/principal';
import icpMainLogo from './assets/icp-main-logo.svg';
import useIcState from './hooks/useIcState';

export default function Home() {
  const { isAnonymous, logout, handleLogin, adminActor, adminPrincipal } =
    useIcState();
  const [error, setError] = useState<string | undefined>();
  const [debouncePrizeExtraction, setDebouncePrizeExtraction] =
    useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionResult, setExtractionResult] = useState<
    Extraction | undefined
  >();
  const [currentAdmins, setCurrentAdmins] = useState<Principal[]>([]);
  const [isAdminOperationLoading, setIsAdminOperationLoading] = useState(false);

  const fetchAdmins = () => {
    if (adminActor) {
      adminActor
        .getAdmins()
        .then(setCurrentAdmins)
        .catch((e) => console.error('Failed to get admins', e));
    }
  };

  useEffect(() => {
    setInterval(() => {
      if (debouncePrizeExtraction) setDebouncePrizeExtraction(false);
    }, 10000);
  }, [debouncePrizeExtraction]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleRemoveAdmin = async (admin: Principal) => {
    if (adminActor) {
      try {
        setIsAdminOperationLoading(true);
        if (
          confirm(`Are you sure you want to remove admin ${admin.toText()}?`)
        ) {
          await adminActor.removeAdmin(admin);
          fetchAdmins();
        }
      } catch (e) {
        console.error('Failed to remove admin', e);
      }
    }
    setIsAdminOperationLoading(false);
  };

  const handleAddAdmin = async () => {
    if (adminActor) {
      try {
        setIsAdminOperationLoading(true);
        const input = prompt('Enter the principal to add as admin');
        if (!input) {
          return;
        }
        const newAdmin = Principal.fromText(input);
        await adminActor.addAdmin(newAdmin);
        fetchAdmins();
      } catch (e) {
        alert(`Failed to add admin: ${e}`);
      }
    }
    setIsAdminOperationLoading(false);
  };

  const extractPrize = async (text: string) => {
    setError(undefined);
    if (debouncePrizeExtraction) return;
    setIsExtracting(true);
    setDebouncePrizeExtraction(true);
    setExtractionResult(undefined);
    if (adminActor) {
      try {
        const userPrincipal: Principal = Principal.fromText(text);
        const extraction = await adminActor.extract(userPrincipal);
        console.log('Extraction result:', extraction);
        setExtractionResult(extraction);

        setTimeout(() => {
          setExtractionResult(undefined);
        }, 10_000);
      } catch (err: any) {
        console.error(err);
        const errorMsg = err.message || 'Failed to extract: Unknown error';
        setError(errorMsg);
      }
    }
    setIsExtracting(false);
  };

  if (!adminPrincipal) {
    return (
      <div className='flex h-full w-full items-center justify-center text-center text-white'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      {isAnonymous && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
          <img
            className='absolute left-0 right-0 top-10 z-20 m-auto h-32'
            src='/brand-logo.png'
            alt='icpItCh logo'
          />
          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
          <button
            className='w-44 rounded-xl bg-white px-4 py-2 text-center text-xl shadow-sm'
            onClick={() => handleLogin()}
          >
            Admin
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
        <div className='flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto'>
          <Scanner
            styles={{
              container: {
                // set width and padding this way to have a 1:1 aspect ratio
                width: '100%',
                paddingTop: '100%',
              },
            }}
            onResult={(text) => extractPrize(text)}
            onError={(err) => setError('Scan error: ' + err)}
          />
          {isExtracting && (
            <p className='text-center text-3xl text-white'>Extracting...</p>
          )}
          {Boolean(extractionResult) && (
            <p className='text-center text-3xl text-green-500'>
              EXTRACTION SUCCESS!
            </p>
          )}
          {error && (
            <p className='text-center text-sm text-red-500'>
              EXTRACTION ERROR: {error}
            </p>
          )}
          <div className='flex flex-col items-center justify-center gap-4'>
            <p className='gap-2 px-4 text-center text-base font-bold text-white'>
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
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='gap-2 px-3 text-center text-base font-bold text-white'>
              Admins:
              <br />
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                  {currentAdmins.map((admin, index) => (
                    <div key={index} className='flex flex-row gap-2'>
                      <span className='font-mono text-xs font-normal'>
                        {admin.toText()}
                      </span>
                      <button
                        className='text-xs text-red-500'
                        onClick={() => handleRemoveAdmin(admin)}
                        disabled={isAdminOperationLoading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className='mx-auto w-24 rounded-xl bg-white p-1 px-0 text-xs shadow-sm'
                  onClick={handleAddAdmin}
                  disabled={isAdminOperationLoading}
                >
                  <p className='text-black'>
                    {isAdminOperationLoading ? 'Loading...' : 'Add Admin'}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className='flex w-full items-center justify-center pt-4'>
            <button
              className='mx-auto w-24 rounded-xl bg-white p-1 px-0 shadow-sm'
              onClick={logout}
            >
              <p className='text-center text-base'>Logout</p>
            </button>
          </div>
        </div>
      )}
      <img className='z-20 h-32 w-36' src={icpMainLogo} alt='icp main logo' />
    </div>
  );
}
