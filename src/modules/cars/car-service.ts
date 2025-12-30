import { CarRepository } from './car-repository.js';
import { validateCreateCar } from './car-validator.js';
import { CarStatus } from '@prisma/client';
import csv from 'csv-parser';
import { Readable } from 'stream';

export class CarService {
  private carRepository = new CarRepository();

  async getCarList(query: any, companyId: number) {
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const cars = await this.carRepository.findCars({
      companyId,
      skip,
      take: pageSize,
      status: query.status,
      searchBy: query.searchBy,
      keyword: query.keyword,
    });

    const totalCount = await this.carRepository.countCars(companyId);

    return {
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItemCount: totalCount,
      data: cars.map((car) => ({
        id: car.id,
        carNumber: car.carNumber,
        manufacturer: car.carModel.manufacturer,
        model: car.carModel.model,
        type: car.carModel.type,
        manufacturingYear: car.manufacturingYear,
        mileage: car.mileage,
        price: car.price,
        accidentCount: car.accidentCount,
        explanation: car.explanation,
        accidentDetails: car.accidentDetails,
        status: car.status,
      })),
    };
  }

  async getCarDetail(carId: number, companyId: number) {
    const car = await this.carRepository.findCarById(companyId, carId);
    if (!car) throw new Error('존재하지 않는 차량입니다');

    return {
      id: car.id,
      carNumber: car.carNumber,
      manufacturer: car.carModel.manufacturer,
      model: car.carModel.model,
      type: car.carModel.type,
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: car.price,
      accidentCount: car.accidentCount,
      explanation: car.explanation,
      accidentDetails: car.accidentDetails,
      status: car.status,
    };
  }

  async createCar(body: any, companyId: number) {
    validateCreateCar(body);

    const carModel = await this.carRepository.findOrCreateCarModel(
      body.manufacturer,
      body.model,
      body.type
    );

    return this.carRepository.createCar({
      carNumber: body.carNumber,
      manufacturingYear: body.manufacturingYear,
      mileage: body.mileage,
      price: body.price,
      accidentCount: body.accidentCount,
      explanation: body.explanation,
      accidentDetails: body.accidentDetails,
      status: CarStatus.POSSESSION,
      companyId,
      carModelId: carModel.id,
    });
  }

  async updateCar(carId: number, body: any, companyId: number) {
    const car = await this.carRepository.findCarById(companyId, carId);
    if (!car) throw new Error('존재하지 않는 차량입니다');

    return this.carRepository.updateCar(carId, body);
  }

  async deleteCar(carId: number, companyId: number) {
    const car = await this.carRepository.findCarById(companyId, carId);
    if (!car) throw new Error('존재하지 않는 차량입니다');

    await this.carRepository.deleteCar(carId);
  }
}

async uploadCSV(file: Express.Multer.File, companyId: number) {
  if (!file) {
    throw new Error('잘못된 요청입니다');
  }

  const rows: any[] = [];

  await new Promise<void>((resolve, reject) => {
    Readable.from(file.buffer)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of rows) {
    const carModel = await this.carRepository.findOrCreateCarModel(
      row.manufacturer,
      row.model,
      row.type,
    );

    await this.carRepository.createCar({
      carNumber: row.carNumber,
      manufacturingYear: Number(row.manufacturingYear),
      mileage: Number(row.mileage),
      price: Number(row.price),
      accidentCount: Number(row.accidentCount),
      explanation: row.explanation || null,
      accidentDetails: row.accidentDetails || null,
      status: 'POSSESSION',
      companyId,
      carModelId: carModel.id,
    });
  }
}
