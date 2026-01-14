import { getCustomersForContract } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

const useCustomersForContract = (keyword: string) => {
  const query = useQuery(
    ['customersForContract', keyword],
    async () => await getCustomersForContract(keyword),
    {
      staleTime: 60 * 1000 * 3, // 3 minutes
      keepPreviousData: true,
      },
  )

  return query
}

export default useCustomersForContract
