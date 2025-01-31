import React, { createContext, useContext, useState } from 'react';

const CoupangApiContext = createContext();

export const useCoupangApi = () => {
  const context = useContext(CoupangApiContext);
  if (!context) {
    throw new Error('useCoupangApi must be used within a CoupangApiProvider');
  }
  return context;
};

export const CoupangApiProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState(() => {
    const savedKeys = localStorage.getItem('coupangApiKeys');
    return savedKeys ? JSON.parse(savedKeys) : {
      accessKey: '',
      secretKey: '',
      subId: ''
    };
  });

  const updateApiKeys = (newKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('coupangApiKeys', JSON.stringify(newKeys));
  };

  return (
    <CoupangApiContext.Provider value={{ apiKeys, updateApiKeys }}>
      {children}
    </CoupangApiContext.Provider>
  );
}; 