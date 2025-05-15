import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './style.css';
import { useTheme } from './contexts/ThemeContext';

// Theme wrapper component that uses ThemeContext and provides MUI theme
const ThemedApp = () => {
  const { mode } = useTheme();
  
  // Create a theme instance based on the current mode
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  );
};

// Import notification and connection providers
import { NotificationProvider } from './contexts/NotificationContext';
import { ConnectionProvider } from './contexts/ConnectionContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <ConnectionProvider>
          <ThemedApp />
        </ConnectionProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
