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
    GetDraft: RequestHandler = async (req, res, next) => {
        const userId = (req as any).user?.id;
        if (!userId) return new ValidationError('잘못된 요청입니다.(userId)');
        const draftList = await docsService.GetDraftList(userId);
        return res.status(200).json(draftList);
    };
    UpLoad: RequestHandler = async (req, res, next) => {
        const file = req.file;
        if (!file) {
            throw new ValidationError('파일이 업로드되지 않았습니다.');
        }

        const userId = (req as any).user?.id;


        const result = await docsService.upload(file, userId);
        return res.status(200).json(result);
    };
    DownLoad: RequestHandler = async (req, res, next) => {
        const { id } = req.params;
        const documentId = Number(id);
        if (isNaN(documentId)) {
            throw new ValidationError('유효하지 않은 ID입니다.');
        }
        const document = await docsService.download(documentId);
        return res.download(document.fileUrl, document.fileName);
    };


}


export const contractDocsController = new ContractDocsController();
