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
    userId?: number | undefined;
    customerId?: number | undefined;
    carId?: number | undefined;
    status?: ContractStatus | undefined;
    resolutionDate?: Date | undefined;
    contractPrice?: number | undefined;
    meetings?: {
        date: Date;
        alarms: Date[];
    }[] | undefined;
    contractDocuments?: {
        id: number;
        fileName: string;
        fileUrl: string;
    }[] | undefined;
}

export {
    CreateContract,
    CreateContractPublic,
    PatchContract,
    ContractStatus
};