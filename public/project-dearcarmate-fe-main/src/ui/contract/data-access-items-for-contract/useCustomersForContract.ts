import { getCustomersForContract } from '@shared/api';
import { useQuery } from '@tanstack/react-query';

const useCustomersForContract = (keyword: string) => {
  const query = useQuery({
    queryKey: ['customersForContract', keyword],
    queryFn: async () => await getCustomersForContract(keyword),
    staleTime: 60 * 1000 * 3, // 3 minutes
    keepPreviousData: true,
    useErrorBoundary: true,
  });

  return query;
};

export default useCustomersForContract;
