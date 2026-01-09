import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../errors/error-handler.js';
import { customersService } from './customer-service.js';

class CustomersController {
  // 고객 등록
  async create(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const data = req.body;

    const customer = await customersService.createCustomer(companyId, data);

    res.status(201).json(customer);
  }

  // 고객 목록 조회
  async findAll(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const { page, pageSize, searchBy, keyword } = req.query as {
      page?: string;
      pageSize?: string;
      searchBy?: 'name' | 'email';
      keyword?: string;
    };

    const result = await customersService.getCustomers(
      companyId,
      page as any,
      pageSize as any,
      searchBy,
      keyword
    );

    res.status(200).json(result);
  }

  // 고객 상세 조회
  async findOne(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const customerId = Number(req.params.customerId);

    if (Number.isNaN(customerId)) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const customer = await customersService.getCustomerById(
      companyId,
      customerId
    );

    res.status(200).json(customer);
  }

  // 고객 수정
  async update(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const customerId = Number(req.params.customerId);

    if (Number.isNaN(customerId)) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const data = req.body;

    const updated = await customersService.updateCustomer(
      companyId,
      customerId,
      data
    );

    res.status(200).json(updated);
  }

  // 고객 삭제
  async delete(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const customerId = Number(req.params.customerId);

    if (Number.isNaN(customerId)) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    await customersService.deleteCustomer(companyId, customerId);

    res.status(200).json({ message: '고객 삭제 성공' });
  }

  // 고객 데이터 대용량 업로드
  async upload(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    if (!req.file) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const companyId = req.user!.companyId;
    const filePath = req.file.path;

    await customersService.bulkUpload(companyId, filePath);

    res.status(200).json({ message: '성공적으로 등록되었습니다' });
  }
}

export default new CustomersController();
