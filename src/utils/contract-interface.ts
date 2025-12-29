import { ContractStatus } from '@prisma/client';

interface CreateContract {
    contractName: string;
    contractPrice: number;
    resolutionDate: Date;
    companyId: number;
    carId: number;
    customerId: number;
    meetings: {
        date: Date;
        alarms: Date[];
    }[];
}
//계약 등록시 프론트로부터 받는 바디값
interface CreateContractPublic {
    carId: number;
    customerId: number;
    meetings: {
        date: Date;
        alarms: Date[];
    }[];
}

interface PatchContract {
    userId?: number;
    customerId?: number;
    carId?: number;
    status?: ContractStatus;
    resolutionDate?: Date;
    contractPrice?: number;
    meetings?: {
        date: Date;
        alarms: Date[];
    }[];
    contractDocuments?: {
        id: number;
        fileName: string;
        fileUrl: string;
    }[];
}

export {
    CreateContract,
    CreateContractPublic,
    PatchContract,
    ContractStatus
};