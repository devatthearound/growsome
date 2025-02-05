import React, { createContext, useContext, useState, useEffect } from 'react';

const CoupangApiContext = createContext();

export const CoupangApiProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState(() => {
    const savedKeys = localStorage.getItem('coupangApiKeys');
    return savedKeys ? JSON.parse(savedKeys) : {
      accessKey: '',
      secretKey: '',
      subId: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('coupangApiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const updateApiKeys = (newKeys) => {
    setApiKeys(newKeys);
  };

  return (
    <CoupangApiContext.Provider value={{ apiKeys, updateApiKeys }}>
      {children}
    </CoupangApiContext.Provider>
  );
};

export const useCoupangApi = () => {
  const context = useContext(CoupangApiContext);
  if (!context) {
    throw new Error('useCoupangApi must be used within a CoupangApiProvider');
  }
  return context;
}; 