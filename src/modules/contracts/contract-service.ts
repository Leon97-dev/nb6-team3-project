
import contractRepository from './contract-repository.js';
import * as ContractInterface from '../../utils/contract-interface.js';
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
    async findAll(searchBy: string, keyword: string) {
        const where: any = {};
        if (keyword) {
            if (searchBy === "customerName") {
                where.customer = { name: { contains: keyword } };
            } else if (searchBy === "userName") {
                where.user = { name: { contains: keyword } };
            }
        }

        const contracts = await contractRepository.findAll(where);

        // status를 기준으로 그룹화하여 반환 형식에 맞게 변환
        const groupedContracts = contracts.reduce((acc: Record<string, any>, contract) => {
            const statusKey = contract.status; // DB의 status 값을 키로 사용

            if (!acc[statusKey]) {
                acc[statusKey] = {
                    totalItemCount: 0,
                    data: [],
                };
            }

            // 데이터 포맷팅 (alarms를 Date 배열로 변환)
            acc[statusKey].data.push({
                ...contract,
                meetings: contract.meetings.map((meeting) => ({
                    ...meeting,
                    alarms: meeting.alarms.map((alarm) => alarm.alarmAt),
                })),
            });
            acc[statusKey].totalItemCount++;

            return acc;
        }, {});

        return groupedContracts;
    }


};

export const contractService = new ContractService();