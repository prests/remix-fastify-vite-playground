import * as React from 'react';

export const NonceContext = React.createContext<{
  script: string;
  style: string;
}>({ script: '', style: '' });
export const NonceProvider = NonceContext.Provider;
export const useNonce = () => React.useContext(NonceContext);
