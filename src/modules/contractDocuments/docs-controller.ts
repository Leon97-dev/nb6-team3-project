import { RequestHandler } from 'express';
import * as s from 'superstruct';
import { ValidationError } from '../../errors/error-handler.js';
import { GetDocsListParams } from '../../utils/docs-struct.js';
import docsService from './docs-service.js';




class ContractDocsController {
    GetList: RequestHandler = async (req, res, next) => {
        let query;
        try {
            query = s.create(req.query, GetDocsListParams);
        } catch (e) {
            throw new ValidationError("잘못된 요청입니다.");
        }

        const { page, pageSize, searchBy, keyword } = query;

        const docsList = await docsService.findAll(page, pageSize, searchBy, keyword);
        return res.status(200).json(docsList);
    };

}


export const contractDocsController = new ContractDocsController();