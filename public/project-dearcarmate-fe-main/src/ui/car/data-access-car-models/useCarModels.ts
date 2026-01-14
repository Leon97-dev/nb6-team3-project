import { useQuery } from '@tanstack/react-query'
import { getCarModels } from '@shared/api'

const useCarModels = () => {
  const query = useQuery(['carModels'], async () => {
    const response = await getCarModels()
    return response.data
  })

  return query
}

export default useCarModels
