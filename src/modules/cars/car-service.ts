import { CarRepository } from './car-repository.js';

// GET 차량 목록 조회
interface GetCarsParams {
  page: number;
  pageSize: number;
  status?: string;
  searchBy?: string;
  keyword?: string;
}

export class CarService {
  private carRepository = new CarRepository();

  async getCars(params: GetCarsParams) {
    const { page, pageSize } = params;

    const { cars, totalItemCount } = await this.carRepository.findCars(params);

    const totalPages = Math.ceil(totalItemCount / pageSize);

    return {
      currentPage: page,
      totalPages,
      totalItemCount,
      data: cars,
    };
  }
}
