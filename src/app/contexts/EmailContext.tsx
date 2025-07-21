'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

// 인터페이스 정의
interface EmailContextType {
  showEmailPopup: boolean;
  setShowEmailPopup: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
}

// Context 생성
const EmailContext = createContext<EmailContextType | undefined>(undefined);

// Provider Props 인터페이스
interface EmailProviderProps {
  children: ReactNode;
}

// EmailProvider 컴포넌트
export function EmailProvider({ children }: EmailProviderProps) {
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const value: EmailContextType = {
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
}

// useEmail 훅
export function useEmail(): EmailContextType {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
}

// Named export for context (필요한 경우)
export { EmailContext };