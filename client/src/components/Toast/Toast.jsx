import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Toast component for displaying notifications
 * @param {Object} props
 * @param {string} props.id - Unique toast ID
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type: 'success' | 'error'
 * @param {Function} props.onDismiss - Callback when toast is dismissed
 */
export const Toast = ({ id, message, type = 'success', onDismiss }) => {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-fresh-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-fresh-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-fresh-900' : 'text-red-900';
  const iconColor = isSuccess ? 'text-fresh-600' : 'text-red-600';

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-xl shadow-medium p-4 min-w-[300px] max-w-md animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${iconColor}`}>
          {isSuccess ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </div>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">{message}</p>

        {/* Close Button */}
        <button
          onClick={() => onDismiss(id)}
          className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

