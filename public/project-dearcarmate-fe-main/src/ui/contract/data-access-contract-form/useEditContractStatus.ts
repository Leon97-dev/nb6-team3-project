import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useConfirmModal from '@ui/shared/modal/confirm-modal/useConfirmModal';
import {
  AxiosErrorData,
  ContractStatus,
  ContractType,
  ContractsListType,
} from '@shared/types';
import { ContractStatusEditFormInput, editContractStatus } from '@shared/api';
import { useContractContext } from '../util-contract-context/ContractContext';

const useEditContractStatus = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();
  const { keyword, searchBy } = useContractContext();

  const mutation = useMutation<
    ContractType,
    AxiosError<AxiosErrorData>,
    {
      id: number;
      data: ContractStatusEditFormInput;
      prevStatus: ContractStatus;
    },
    unknown
  >({
    mutationFn: async ({ id, data }) => await editContractStatus(id, data),
    onSuccess: (newContract, { id, data, prevStatus }) => {
      const queryData: ContractsListType | undefined = queryClient.getQueryData(
        ['contracts', { keyword, searchBy }],
      );
      if (!queryData) return;

      // [수정] 상태값 형식 불일치(대문자 vs 카멜케이스) 해결을 위한 매핑
      const toCamelCase = (status: string) => {
        const map: Record<string, string> = {
          CAR_INSPECTION: 'carInspection',
          PRICE_NEGOTIATION: 'priceNegotiation',
          CONTRACT_DRAFT: 'contractDraft',
          CONTRACT_SUCCESSFUL: 'contractSuccessful',
          CONTRACT_FAILED: 'contractFailed',
        };
        return (map[status] ?? status) as keyof ContractsListType;
      };

      const prevStatusKey = toCamelCase(prevStatus);
      const newStatusKey = toCamelCase(data.status);

      if (!queryData[prevStatusKey] || !queryData[newStatusKey]) return;

      queryClient.setQueryData(['contracts', { keyword, searchBy }], {
        ...queryData,
        [newStatusKey]: {
          data: [...queryData[newStatusKey].data, newContract],
          totalItemCount: queryData[newStatusKey].totalItemCount + 1,
        },
        [prevStatusKey]: {
          data: queryData[prevStatusKey].data.filter(
            (contract) => contract.id !== id,
          ),
          totalItemCount: queryData[prevStatusKey].totalItemCount - 1,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      const text =
        error?.response?.data?.message || '계약 건 상태 수정에 실패했습니다.';
      openConfirmModal({
        text,
      });
    },
  });

  return mutation;
};

export default useEditContractStatus;
