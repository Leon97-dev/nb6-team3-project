import { RequestHandler } from 'express';
import * as s from 'superstruct';
import { contractService } from './contract-service.js';
import { CreateContractStruct } from '../../utils/contract-struct.js';
import { ValidationError } from '../../errors/error-handler.js';



class UserServiceController {
    register: RequestHandler = async (req, res) => {
        // Struct를 사용하여 데이터 검증 및 타입 변환(parseInt 등) 수행
        const validatedData = s.create(req.body, CreateContractStruct);
        if (!validatedData) return new ValidationError("잘못된 요청입니다.");
        const contract = await contractService.register(validatedData);
        return res.status(201).json(contract);
    };
}

export const userServiceController = new UserServiceController();