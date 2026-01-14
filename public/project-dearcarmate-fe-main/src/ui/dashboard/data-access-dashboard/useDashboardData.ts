import { getDashboardData } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

const useDashboardData = () => {
  const query = useQuery(
    ['dashboard'],
    async () => await getDashboardData(),
    {},
  )

  return query
}

export default useDashboardData
