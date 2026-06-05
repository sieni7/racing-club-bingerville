import { useGetMeQuery } from '../features/api/authApi';

export const useAuth = () => {
  const { data, isLoading, isError, isFetching } = useGetMeQuery(undefined, {
    // On peut utiliser polling ou refetchOnMountOrArgChange si besoin
  });

  const user = data?.data;

  return {
    user,
    isAuthenticated: !!user && !isError,
    isLoading: isLoading || isFetching,
  };
};
