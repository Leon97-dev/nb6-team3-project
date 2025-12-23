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

export {
    CreateContract,
    CreateContractPublic
};