import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <NotificationProvider>
            <AuthProvider>
              <LeadProvider>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: 'bg-white dark:bg-gray-800 text-slate-800 dark:text-white border border-slate-200/80 dark:border-gray-750 text-xs font-semibold rounded-xl shadow-lg transition-colors duration-200',
                    duration: 3000
                  }}
                />
              </LeadProvider>
            </AuthProvider>
          </NotificationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;