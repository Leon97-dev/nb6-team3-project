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
                        }
                    }

                }
            })
        ]);
        return { totalItemCount, contracts };
    }
    async GetDraftList() {
        const userdata = await prisma.contract.findMany({
            where: {
                status: "CONTRACT_SUCCESSFUL",
            },
            select: {
                id: true,
                contractName: true,
            }
        });
        return userdata;
    }
    async UpLoad() {
    }
    async DownLoad() {
    }
}
const docsRepository = new DocsRepository();
export default docsRepository;