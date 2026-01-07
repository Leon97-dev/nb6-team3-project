
import contractRepository from './contract-repository.js';
import * as ContractInterface from '../../utils/contract-interface.js';
import { NotFoundError, ValidationError } from './../../errors/error-handler.js';
import { Prisma } from '@prisma/client';


class ContractService {
    async register(contractData: ContractInterface.CreateContractPublic) {
        const companyId = await contractRepository.findCompanyIdByCarId(contractData.carId);
        if (!companyId) return new NotFoundError("차량에 등록된 회사Id를 찾을 수 없습니다.");
        const carInfo = await contractRepository.findCarInfoByCarId(contractData.carId);
        if (!carInfo) return new NotFoundError("잘못된 요청입니다.(carId)");
        const customerInfo = await contractRepository.findCustomerInfoByCustomerId(contractData.carId);
        if (!customerInfo) return new NotFoundError("잘못된 요청입니다.(customerId)");
        const _contractName = `${carInfo.carModel} - ${customerInfo.name} 고객님`;
        const readyData: ContractInterface.CreateContract = {
            ...contractData,
            contractName: _contractName,
            companyId: companyId.companyId,
            resolutionDate: new Date(),
        };
        const createdContractData = await contractRepository.create(readyData);
        if (!createdContractData) return new NotFoundError();
        return {
            ...createdContractData,
            meetings: createdContractData.meetings.map((meeting) => ({
                ...meeting,
                alarms: meeting.alarms.map((alarm) => alarm.alarmAt),
            })),
        };
    }

    async validateWriter(contractId: number, userId: number) {
        const contract = await contractRepository.findById(contractId);
        if (!contract) throw new NotFoundError("존재하지 않는 계약입니다.");
        return contract.user?.id === userId;
    }

    async findAll(searchBy: string, keyword: string) {
        const where: any = {};
        if (keyword) {
            if (searchBy === "customerName") {
                where.customer = { name: { contains: keyword } };
            } else if (searchBy === "userName") {
                where.user = { name: { contains: keyword } };
            }
        }

        const contracts = await contractRepository.findAll(where);

        // status를 기준으로 그룹화하여 반환 형식에 맞게 변환
        const groupedContracts = contracts.reduce((acc: Record<string, any>, contract) => {
            const statusKey = contract.status; // DB의 status 값을 키로 사용

            if (!acc[statusKey]) {
                acc[statusKey] = {
                    totalItemCount: 0,
                    data: [],
                };
            }

            // 데이터 포맷팅 (alarms를 Date 배열로 변환)
            acc[statusKey].data.push({
                ...contract,
                meetings: contract.meetings.map((meeting) => ({
                    ...meeting,
                    alarms: meeting.alarms.map((alarm) => alarm.alarmAt),
                })),
            });
            acc[statusKey].totalItemCount++;

            return acc;
        }, {});

        return groupedContracts;
    }

    async patchContract(id: number, data: ContractInterface.PatchContract) {
        const { meetings, contractDocuments, ...rest } = data;

        // exactOptionalPropertyTypes 대응: undefined인 필드는 제외하고 객체 생성
        const updateData: Prisma.ContractUpdateInput = Object.fromEntries(
            Object.entries(rest).filter(([_, v]) => v !== undefined)
        );

        // 관계 데이터 처리 (기존 데이터를 삭제하고 새로 생성하는 방식)
        if (meetings) {
            updateData.meetings = {
                deleteMany: {}, // 기존 미팅 삭제
                create: meetings.map((meeting) => ({
                    date: meeting.date,
                    alarms: {
                        create: meeting.alarms.map((alarm) => ({
                            alarmAt: alarm
                        }))
                    }
                }))
            };
        }

        if (contractDocuments) {
            updateData.documents = {
                deleteMany: {}, // 기존 문서 연결/데이터 삭제
                create: contractDocuments.map((doc) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl
                }))
            };
        }
        const patchedData = await contractRepository.patchContract(id, updateData);
        if (!patchedData) return new NotFoundError("존재하지 않는 계약입니다");

        return patchedData;
    }
    async deleteContract(id: number) {
        const deletedContract = await contractRepository.deleteContract(id);
        if (!deletedContract) return new NotFoundError("존재하지 않는 계약입니다.");
        return deletedContract;
    }
    async findCarList() {
        const carList = await contractRepository.findCarList();
        if (!carList) throw new ValidationError("잘못된 요청입니다.");
        const cars = carList.map((car) => ({
            id: car.id,
            data: `${car.carModel}(${car.carNumber})`
        }));
        return cars;
    }
    async findCustomerList() {
        const customerList = await contractRepository.findCustomerList();
        if (!customerList) throw new ValidationError("잘못된 요청입니다.");
        const customers = customerList.map((data) => ({
            id: data.id,
            data: `${data.name}(${data.email})`
        }));
        return customers;
    }
    async findUserList() {
        const userList = await contractRepository.findUserList();
        if (!userList) throw new ValidationError("잘못된 요청입니다.");
        const users = userList.map((data) => ({
            id: data.id,
            data: `${data.name}(${data.email})`
        }));
        return users;
    }

};

export const contractService = new ContractService();