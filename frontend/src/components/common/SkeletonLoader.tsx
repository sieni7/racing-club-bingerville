interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list' | 'grid';
  count?: number;
}

export const SkeletonLoader = ({ type = 'card', count = 1 }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-soft animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
            </div>
          </div>
        );
      case 'table':
        return (
          <tr className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
            <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" /></td>
            <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" /></td>
          </tr>
        );
      case 'grid':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mx-auto" />
          </div>
        );
      default:
        return null;
    }
  };

  return <>{Array.from({ length: count }).map((_, i) => <div key={i}>{renderSkeleton()}</div>)}</>;
};
