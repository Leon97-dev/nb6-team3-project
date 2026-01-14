import { getDraftsForContractDocument } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

const useDrafts = () => {
  const query = useQuery(
    ['draftsForContractDocument'],
    async () => await getDraftsForContractDocument(),
    {},
  )

  return query
}

export default useDrafts
