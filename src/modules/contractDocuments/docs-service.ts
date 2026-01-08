import { Prisma } from '@prisma/client';
import docsRepository from './docs-repository.js';
import prisma from '../../configs/prisma.js';
import { ValidationError } from '../../errors/error-handler.js';

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

    async upload(file: { originalname: string; path: string; size: number; mimetype: string; }, userId: number) {
        const { id } = await docsRepository.UpLoad({
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size,
            contentType: file.mimetype,
            uploadedByUserId: userId,
        });
        return { contractDocumentId: id };
    }

    async download(id: number) {
        const document = await docsRepository.findById(id);
        if (!document) {
            throw new ValidationError('파일을 찾을 수 없습니다.');
        }
        return document;
    }
}

const docsService = new DocsService();
export default docsService;