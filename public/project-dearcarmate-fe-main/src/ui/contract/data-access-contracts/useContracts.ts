import { getContracts } from '@shared/api'
import { SearchByContract } from '@shared/types'
import { useQuery } from '@tanstack/react-query'

const useContracts = ({ searchBy, keyword }: { searchBy: SearchByContract, keyword: string }) => {
  const query = useQuery(
    ['contracts', { searchBy, keyword }],
    async () => await getContracts({ searchBy, keyword }),
    {},
  )

  return query
}

export default useContracts
