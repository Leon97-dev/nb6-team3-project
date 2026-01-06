import prisma from './../../configs/prisma.js';
import { CreateContract } from '../../utils/contract-interface.js';
import { Prisma } from '@prisma/client';

class ContractRepository {
    async create(data: CreateContract) {
        const contract = await prisma.contract.create({
            data: {
                contractName: data.contractName ?? null,
                contractPrice: data.contractPrice ?? null,
                resolutionDate: data.resolutionDate ?? null,
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

    async findById(id: number) {
        return await prisma.contract.findUnique({
            where: { id },
            select: {
                id: true,
                user: {
                    select: { id: true }
                }
            }
        });
    }
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
    async findCarInfoByCarId(carId: number) {
        const companyId = await prisma.car.findFirst({
            where: {
                id: carId,
            }, select: {
                model: true,
            }
        });
        return companyId;
    };
    async findCustomerInfoByCustomerId(customerId: number) {
        const companyId = await prisma.customer.findFirst({
            where: {
                id: customerId,
            }, select: {
                name: true,
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
    async deleteContract(id: number) {
        try {
            return await prisma.contract.delete({
                where: { id }
            });
        } catch (error) {
            return null;
        }
    }
    //Todo - 차량 계약 관련 api 병합시 status 가 POSSESSION인지,
    //       차량 모델관련 변수가 model이 맞는지 추가 확인 필요
    async findCarList() {
        return await prisma.car.findMany({
            where: {
                status: "POSSESSION"
            },
            select: {
                id: true,
                model: true,
                carNumber: true
            }
        });
    }
    async findCustomerList() {
        return await prisma.customer.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }
    async findUserList() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }
}
const contractRepository = new ContractRepository();
export default contractRepository;
