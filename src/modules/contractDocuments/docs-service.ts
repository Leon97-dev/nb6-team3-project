import { Prisma } from '@prisma/client';
import docsRepository from './docs-repository.js';
import prisma from '../../configs/prisma.js';
import { contractService } from '../contracts/contract-service.js';

class DocsService {
    async findAll(page: number = 1, pageSize: number = 10, searchBy: string = "", keyword: string = "") {
        const where: Prisma.ContractWhereInput = {};
        if (keyword) {
            if (searchBy === 'contractName') {
                where.contractName = { contains: keyword };
            } else if (searchBy === 'userName') {
                where.user = { name: { contains: keyword } };
            }
        }

        const { totalItemCount, contracts } = await docsRepository.GetAllList(where, page, pageSize);
        const totalPages = Math.ceil(totalItemCount / pageSize);

        const data = contracts.map((contract) => ({
            id: contract.id,
            contractName: contract.contractName,
            resolutionDate: contract.resolutionDate,
            documentCount: contract.documents.length,
            userName: contract.user?.name ?? "",
            carNumber: contract.car?.carNumber ?? "",
            documents: contract.documents,
        }));

        return {
            currentPage: page,
            totalPages,
            totalItemCount,
            data,
        };
    }
    async GetDraftList() {
        const userlist = await docsRepository.GetDraftList();
        const data = userlist.map((user) => ({
            id: user.id,
            data: user.contractName,
        }));
        return data;
    }

}

const docsService = new DocsService();
export default docsService;