import prisma from './../../configs/prisma.js';
import { CreateContract } from '../../utils/contract-interface.js';
import { Prisma } from '@prisma/client';

class ContractRepository {
    async create(data: CreateContract) {
        const contract = await prisma.contract.create({
            data: {
                contractName: data.contractName,
                contractPrice: data.contractPrice,
                resolutionDate: data.resolutionDate,
                companyId: data.companyId,
                carId: data.carId,
                customerId: data.customerId,
                meetings: {
                    create: data.meetings.map((meeting) => ({
                        date: meeting.date,
                        alarms: {
                            create: meeting.alarms.map((alarm: Date) => ({
                                alarmAt: alarm
                            }))
                        }
                    }))
                }
            },
            select: {
                id: true,
                status: true,
                resolutionDate: true,
                contractPrice: true,
                meetings: {
                    select: {
                        date: true,
                        alarms: {
                            select: {
                                alarmAt: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                car: {
                    select: {
                        id: true,
                        model: true,
                    },
                },
            }
        });
        return contract;
    };
    async findAll(where: Prisma.ContractWhereInput) {
        return await prisma.contract.findMany({
            where,
            select: {
                id: true,
                status: true,
                resolutionDate: true,
                contractPrice: true,
                meetings: {
                    select: {
                        date: true,
                        alarms: {
                            select: {
                                alarmAt: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                car: {
                    select: {
                        id: true,
                        model: true,
                    },
                },
            }
        });
    };

    async findCompanyIdByCarId(carId: number) {
        const companyId = await prisma.car.findFirst({
            where: {
                id: carId,
            }, select: {
                companyId: true,
            }
        });
        return companyId;
    };
    async patchContract(id: number, data: Prisma.ContractUpdateInput) {
        return await prisma.contract.update({
            where: {
                id,
            },
            data,
        });
    };
}
const contractRepository = new ContractRepository();
export default contractRepository;
