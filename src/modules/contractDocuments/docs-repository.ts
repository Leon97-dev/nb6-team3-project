import prisma from './../../configs/prisma.js';
import { CreateContract } from '../../utils/contract-interface.js';
import { Prisma } from '@prisma/client';

class DocsRepository {
    async GetAllList(where: Prisma.ContractWhereInput, page: number, pageSize: number) {
        const [totalItemCount, contracts] = await Promise.all([
            prisma.contract.count({ where }),
            prisma.contract.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    resolutionDate: 'desc',
                },
                select: {
                    id: true,
                    contractName: true,
                    resolutionDate: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    car: {
                        select: {
                            carNumber: true,
                        },
                    },
                    documents: {
                        select: {
                            id: true,
                            fileName: true,
                            fileUrl: true,
                            fileSize: true,
                            contentType: true,
                        }
                    }

                }
            })
        ]);
        return { totalItemCount, contracts };
    }
    async GetDraftList(where: Prisma.ContractWhereInput) {
        const userdata = await prisma.contract.findMany({
            where,
            select: {
                id: true,
                contractName: true,
            }
        });
        return userdata;
    }
    async findContractIdByUserId(userId: number) {
        const contractId = await prisma.contract.findFirst({
            where: {
                userId: userId,
            }, select: {
                id: true,
            }
        });
        return contractId?.id;
    }
    async GetCompanyCode(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                company: {
                    select: {
                        companyCode: true
                    }
                },
            }
        });
        return user?.company?.companyCode;
    }
    async UpLoad(data: Prisma.ContractDocumentCreateInput) {
        return await prisma.contractDocument.create({
            data,
        });
    }
    async findById(id: number) {
        return await prisma.contractDocument.findUnique({
            where: { id },
        });
    }
}
const docsRepository = new DocsRepository();
export default docsRepository;
