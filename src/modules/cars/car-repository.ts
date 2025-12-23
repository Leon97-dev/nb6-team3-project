// GET 차량 목록 조회
interface Car {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  type: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string;
  accidentDetails: string;
  status: 'possession' | 'contractProceeding' | 'contractCompleted';
}

export class CarRepository {
  private cars: Car[] = Array.from({ length: 50 }).map((_, index) => ({
    id: index + 1,
    carNumber: `12가${1000 + index}`,
    manufacturer: 'Hyundai',
    model: 'Sonata',
    type: 'Sedan',
    manufacturingYear: 2020,
    mileage: 30,
    price: 1000000,
    accidentCount: 1,
    explanation: 'string',
    accidentDetails: 'string',
    status: 'possession',
  }));

  async findCars({
    page,
    pageSize,
    status,
    searchBy,
    keyword,
  }: any): Promise<{ cars: Car[]; totalItemCount: number }> {
    let filteredCars = [...this.cars];

    if (status) {
      filteredCars = filteredCars.filter((car) => car.status === status);
    }

    if (searchBy && keyword) {
      filteredCars = filteredCars.filter((car) =>
        car[searchBy].includes(keyword)
      );
    }

    const totalItemCount = filteredCars.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      cars: filteredCars.slice(start, end),
      totalItemCount,
    };
  }
}
