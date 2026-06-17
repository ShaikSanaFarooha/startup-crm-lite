import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium text-slate-800 bg-white border border-slate-100 rounded-xl shadow-lg',
          duration: 3000,
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

