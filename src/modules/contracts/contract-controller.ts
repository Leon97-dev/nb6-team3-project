import { RequestHandler } from 'express';
import * as s from 'superstruct';
import { contractService } from './contract-service.js';
import {
  CreateContractStruct,
  PatchContractStruct,
} from '../../utils/contract-struct.js';
import { ValidationError } from '../../errors/error-handler.js';

class ContractController {
  register: RequestHandler = async (req, res) => {
    // Struct를 사용하여 데이터 검증 및 타입 변환(parseInt 등) 수행
    const validatedData = s.create(req.body, CreateContractStruct);
    if (!validatedData) return new ValidationError('잘못된 요청입니다.');
    const userId = (req as any).user?.id;
    if (!userId) return new ValidationError('잘못된 요청입니다.(userId)');
    const contract = await contractService.register({
      ...validatedData,
      userId,
    });
    return res.status(201).json(contract);
  };

  findAll: RequestHandler = async (req, res) => {
    const { searchBy, keyword } = req.query;
    // if(!searchBy || !keyword) return new ValidationError("잘못된 요청입니다.");
    if (searchBy) {
      if (searchBy === 'customerName' || searchBy === 'userName') {
      } else {
        return new ValidationError('잘못된 요청입니다.');
      }
    }
    const contracts = await contractService.findAll(
      searchBy as string,
      keyword as string
    );
    return res.status(200).json(contracts);
  };
  patchContract: RequestHandler = async (req, res) => {
    const id = req.params.id;
    if (!id) return new ValidationError('잘못된 요청 입니다.(id)');

    const contractId = parseInt(id);
    const userId = (req as any).user?.id;

    const isWriter = await contractService.validateWriter(contractId, userId);
    if (!isWriter) {
      return res.status(403).json({ message: '담당자만 수정이 가능합니다.' });
    }

    const validatedData = s.create(req.body, PatchContractStruct);
    if (!validatedData) return new ValidationError('잘못된 요청입니다.');
    const patchedData = await contractService.patchContract(
      contractId,
      validatedData
    );
    return res.status(200).json(patchedData);
  };
  deleteContract: RequestHandler = async (req, res) => {
    const id = req.params.id;
    if (!id) return new ValidationError('잘못된 요청 입니다.(id)');

    const contractId = parseInt(id);
    const userId = (req as any).user?.id;
    const isWriter = await contractService.validateWriter(contractId, userId);
    if (!isWriter) {
      return res.status(403).json({ message: '담당자만 삭제가 가능합니다.' });
    }

    await contractService.deleteContract(contractId);
    return res.status(204).send();
  };
  findCarList: RequestHandler = async (req, res) => {
    const carList = await contractService.findCarList();
    return res.status(200).json(carList);
  };
  findCustomerList: RequestHandler = async (req, res) => {
    const customerList = await contractService.findCustomerList();
    return res.status(200).json(customerList);
  };
  findUserList: RequestHandler = async (req, res) => {
    const userList = await contractService.findUserList();
    return res.status(200).json(userList);
  };
}

export const contractController = new ContractController();
