import { Prisma } from '@prisma/client';
import docsRepository from './docs-repository.js';
import prisma from '../../configs/prisma.js';
import { NotFoundError, ValidationError } from './../../errors/error-handler.js';

class DocsService {
    async findAll(userId: number, page: number = 1, pageSize: number = 10, searchBy: string = "", keyword: string = "") {


        const companyCode = await docsRepository.GetCompanyCode(userId);
        if (!companyCode) throw new NotFoundError("사용자의 회사 정보를 찾을 수 없습니다.");

        const where: Prisma.ContractWhereInput = { company: { companyCode } };
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
    async GetDraftList(userId: number) {
        const companyCode = await docsRepository.GetCompanyCode(userId);
        if (!companyCode) throw new NotFoundError("사용자의 회사 정보를 찾을 수 없습니다.");
        const where: any = { status: "CONTRACT_SUCCESSFUL", company: { companyCode }, userId };
        const userlist = await docsRepository.GetDraftList(where);
        const data = userlist.map((user) => ({
            id: user.id,
            data: user.contractName,
        }));
        return data;
    }

    async upload(
        file: { originalname: string; path: string; size: number; mimetype: string; },
        userId: number
    ) {
        const contractIdRaw = await docsRepository.findContractIdByUserId(userId);
        if (!contractIdRaw) {
            throw new ValidationError('계약 ID를 찾을 수 없습니다.');
        }
        const data: Prisma.ContractDocumentCreateInput = {
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size,
            contentType: file.mimetype,
            ...(userId && { uploadedByUser: { connect: { id: userId } } }),
            contract: { connect: { id: contractIdRaw } },
        };
        const document = await docsRepository.UpLoad(data);
        return document;
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
