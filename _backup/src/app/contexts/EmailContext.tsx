'use client';

import React, { createContext, useState } from 'react';

interface EmailContextType {
  showEmailPopup: boolean;
  setShowEmailPopup: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

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