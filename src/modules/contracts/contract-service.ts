import { Request, Response } from 'express';
import contractRepository from './contract-repository.js';
import * as ContractInterface from './../../utils/interface.js';
import { NotFoundError } from './../../errors/error-handler.js';


class ContractService {
    async register(contractData: ContractInterface.CreateContractPublic) {
        const companyId = await contractRepository.findCompanyIdByCarId(contractData.carId);
        if (!companyId) return new NotFoundError("차량에 등록된 회사Id를 찾을 수 없습니다.");
        const readyData: ContractInterface.CreateContract = {
            ...contractData,
            companyId: companyId.companyId,
            contractName: "",
            contractPrice: 0,
            resolutionDate: new Date(),
        };
        const createdContractData = await contractRepository.create(readyData);
        if (!createdContractData) return new NotFoundError();
        return {
            ...createdContractData,
            meetings: createdContractData.meetings.map((meeting) => ({
                ...meeting,
                alarms: meeting.alarms.map((alarm) => alarm.alarmAt),
            })),
        };
    }
};

export const contractService = new ContractService();