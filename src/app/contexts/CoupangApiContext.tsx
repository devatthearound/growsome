import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeys {
  accessKey: string;
  secretKey: string;
  subId: string;
}

interface CoupangApiContextType {
  apiKeys: ApiKeys;
  updateApiKeys: (newKeys: ApiKeys) => void;
}

const CoupangApiContext = createContext<CoupangApiContextType | undefined>(undefined);

export const CoupangApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    accessKey: '',
    secretKey: '',
    subId: ''
  });

  useEffect(() => {
    const savedKeys = localStorage.getItem('coupangApiKeys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coupangApiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  const updateApiKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
  };

  return (
    <CoupangApiContext.Provider value={{ apiKeys, updateApiKeys }}>
      {children}
    </CoupangApiContext.Provider>
  );
};

export const useCoupangApi = (): CoupangApiContextType => {
  const context = useContext(CoupangApiContext);
  if (!context) {
    throw new Error('useCoupangApi must be used within a CoupangApiProvider');
  }
  return context;
}; 