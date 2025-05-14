import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import '../styles/offline.css';

// Context type definition
interface ConnectionContextType {
  isOnline: boolean;
  isServerConnected: boolean | null;
  lastOnlineTime: Date | null;
}

// Create the context with default values
const ConnectionContext = createContext<ConnectionContextType>({
  isOnline: true,
  isServerConnected: null,
  lastOnlineTime: null
});

interface ConnectionProviderProps {
  children: ReactNode;
  serverConnected?: boolean | null;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ 
  children, 
  serverConnected = null 
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isServerConnected, setIsServerConnected] = useState<boolean | null>(serverConnected);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(isOnline ? new Date() : null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update server connection status when prop changes
  useEffect(() => {
    if (serverConnected !== isServerConnected) {
      setIsServerConnected(serverConnected);
      // If server connected, update last online time
      if (serverConnected) {
        setLastOnlineTime(new Date());
      }
    }
  }, [serverConnected]);

  return (
    <ConnectionContext.Provider value={{ isOnline, isServerConnected, lastOnlineTime }}>
      <div className={!isOnline || isServerConnected === false ? 'offline-mode' : ''}>
        {children}
        {(!isOnline || isServerConnected === false) && (
          <div className="offline-badge">
            <span>Offline Mode</span>
          </div>
        )}
      </div>
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);

interface OfflineFallbackProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const OfflineFallback: React.FC<OfflineFallbackProps> = ({ children, fallback }) => {
  const { isOnline, isServerConnected } = useConnection();
  
  if (!isOnline || isServerConnected === false) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
