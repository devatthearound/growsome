import React, { createContext, useState } from 'react';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');

  const value = {
    showEmailPopup,
    setShowEmailPopup,
    email,
    setEmail
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
}; 