import prisma from './../../configs/prisma.js';
import { CreateContract } from '../../utils/contract-interface.js';
import { Prisma } from '@prisma/client';

class DocsRepository {
    async GetAllList(where: Prisma.ContractDocumentWhereInput, page: number, pageSize: number) {
        // const [totalItemCount, docs] = await pri
    }

}
const docsRepository = new DocsRepository();
export default docsRepository;