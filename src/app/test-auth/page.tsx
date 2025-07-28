'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTestPage = () => {
  const { user, isLoggedIn, isLoading, refreshAuth } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDebugAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-auth');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Test login result:', data);
      
      // Refresh auth state
      await refreshAuth();
    } catch (error) {
      console.error('Test login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-auth', {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Test logout result:', data);
      
      // Refresh auth state
      await refreshAuth();
    } catch (error) {
      console.error('Test logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div className="p-8">인증 테스트 페이지 로딩중...</div>}>
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Auth System Debug</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Current Auth Status</h2>
        <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
          <div><strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</div>
          <div><strong>User Info:</strong></div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Test Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleDebugAuth}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            {loading ? 'Loading...' : 'Get Debug Info'}
          </button>
          
          <button 
            onClick={handleTestLogin}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Test Login
          </button>
          
          <button 
            onClick={handleTestLogout}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Test Logout
          </button>
          
          <button 
            onClick={refreshAuth}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Refresh Auth
          </button>
        </div>
      </div>

      {debugInfo && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Debug Information</h2>
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#666' }}>
        <h3>How to use:</h3>
        <ol>
          <li>Click "Get Debug Info" to check current status</li>
          <li>Click "Test Login" to create fake auth token</li>
          <li>Click "Refresh Auth" to see status changes</li>
          <li>Check console logs for detailed debugging</li>
        </ol>
      </div>
    </div>
    </Suspense>
  );
};

export default AuthTestPage;
