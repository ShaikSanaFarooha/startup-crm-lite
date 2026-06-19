import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

const CURRENCY_LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'en-IE', // Uses standard English-style commas but Euro symbol
  GBP: 'en-GB',
  JPY: 'ja-JP'
};

export const SettingsProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('crm_user_name') || 'Sana';
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('crm_user_email') || 'sana@crmlite.com';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('crm_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('crm_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('crm_user_email', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('crm_currency', currency);
  }, [currency]);

  // Safe helper to extract numeric value from string (supporting any currency symbol)
  const parseNumericValue = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const numeric = parseFloat(val.replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  };

  // Helper to format any value based on currently active currency
  const formatCurrency = (val) => {
    const num = parseNumericValue(val);
    try {
      return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(num);
    } catch (e) {
      // Fallback
      const symbol = CURRENCY_SYMBOLS[currency] || '$';
      return `${symbol}${num.toLocaleString()}`;
    }
  };

  const getCurrencySymbol = () => {
    return CURRENCY_SYMBOLS[currency] || '$';
  };

  return (
    <SettingsContext.Provider
      value={{
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        currency,
        setCurrency,
        formatCurrency,
        getCurrencySymbol,
        parseNumericValue
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
