import * as s from 'superstruct';
import * as ContractInterface from './contract-interface.js';

// 문자열이 들어오면 숫자로 변환해주는 커스텀 구조체
const CoercedNumber = s.coerce(s.number(), s.union([s.number(), s.string()]), (value) =>
    typeof value === 'string' ? parseInt(value, 10) : value
);

// 날짜 문자열을 Date 객체로 변환
const CoercedDate = s.coerce(s.date(), s.string(), (value) => new Date(value));

export const CreateContractStruct = s.object({
    carId: CoercedNumber, // 여기서 parseInt 처리가 일어납니다.
    customerId: CoercedNumber, // 여기서 parseInt 처리가 일어납니다.
    meetings: s.size(
        s.array(
            s.object({
                date: CoercedDate,
                alarms: s.array(CoercedDate)
            })
        ),
        0,
        3
    ),
});

export const PatchContractStruct = s.object({
    userId: s.optional(CoercedNumber),
    customerId: s.optional(CoercedNumber),
    carId: s.optional(CoercedNumber),
    status: s.optional(s.enums(Object.values(ContractInterface.ContractStatus))),
    resolutionDate: s.optional(CoercedDate),
    contractPrice: s.optional(CoercedNumber),
    meetings: s.optional(s.size(
        s.array(
            s.object({
                date: CoercedDate,
                alarms: s.array(CoercedDate)
            })
        ),
        0,
        3
    )),
    contractDocuments: s.optional(s.array(
        s.object({
            id: CoercedNumber,
            fileName: s.string(),
            fileUrl: s.string()
        })
    )),
});