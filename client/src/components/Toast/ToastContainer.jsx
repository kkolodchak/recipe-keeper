import { createPortal } from 'react-dom';
import { Toast } from './Toast.jsx';

/**
 * ToastContainer component that displays and manages multiple toasts
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects
 * @param {Function} props.onDismiss - Callback when a toast is dismissed
 */
export const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) {
    return null;
  }

  const toastContent = (
    <div 
      className="fixed top-4 right-4 flex flex-col gap-3 pointer-events-none"
      style={{ 
        zIndex: 99999,
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        maxWidth: '420px'
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );

  // Use portal to render toasts at document body level
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(toastContent, document.body);
  }
  
  // Fallback if document.body is not available
  return toastContent;
};

