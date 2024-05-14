import { Scanner } from '@yudiel/react-qr-scanner';
import React from 'react';

export default function Login() {
  return (
    <>
      <Scanner
        onResult={(text, result) => console.log(text, result)}
        onError={(error) => console.log('Error', error?.message)}
      />
    </>
  );
}
