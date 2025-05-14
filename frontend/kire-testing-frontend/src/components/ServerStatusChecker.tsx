import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import apiClient from '../services/apiClient';
import { useNotification } from '../contexts/NotificationContext';
import { retry } from '../utils/apiHelpers';

interface ServerStatusCheckerProps {
  onStatusChange?: (isConnected: boolean) => void;
}

const ServerStatusChecker: React.FC<ServerStatusCheckerProps> = ({ onStatusChange }) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { showNotification } = useNotification();

  const checkServerStatus = async () => {
    if (isChecking) return; // Prevent multiple simultaneous checks
    
    setIsChecking(true);
    try {
      // Try to connect to the API server with retry
      await retry(async () => {
        const response = await apiClient.get('/health');
        return response.data;
      }, 2, 1000);
      
      if (!isConnected) {
        // Only notify if there was a status change from offline to online
        if (isConnected === false) {
          showNotification('Connection to server restored.', 'success');
        }
        setIsConnected(true);
        onStatusChange?.(true);      }
    } catch (error) {
      console.error('API server connection failed:', error);
      if (isConnected !== false) {
        setIsConnected(false);
        onStatusChange?.(false);
        showNotification('Cannot connect to the API server. Please check your connection.', 'error');
      }
    } finally {
      setIsChecking(false);
    }
  };
  useEffect(() => {
    // Check connection when component mounts
    checkServerStatus();
    
    // Set up interval to check connection status
    const intervalId = setInterval(() => {
      checkServerStatus();
    }, 30000); // Check every 30 seconds
    
    // Also check when the browser comes back online
    const handleOnline = () => {
      checkServerStatus();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isConnected === null || isChecking) {
    return (
      <Box display="flex" alignItems="center">
        <CircularProgress size={16} sx={{ mr: 1 }} />
        <Typography variant="body2">Checking connection...</Typography>
      </Box>
    );
  }

  return null;
};

export default ServerStatusChecker;
