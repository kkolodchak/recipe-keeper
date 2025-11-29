import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/Toast/ToastContainer.jsx';

const ToastContext = createContext(null);

/**
 * ToastProvider component that provides toast functionality to the app
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success' | 'error' (default: 'success')
   */
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        message,
        type,
      },
    ]);
  }, []);

  /**
   * Dismiss a toast by ID
   * @param {string} id - Toast ID to dismiss
   */
  const dismissToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use ToastContext
 * @throws {Error} If used outside ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

