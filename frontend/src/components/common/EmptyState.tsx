import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ title, message, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
