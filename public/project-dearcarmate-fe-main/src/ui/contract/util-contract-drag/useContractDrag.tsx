import { ContractStatus, ContractType } from '@shared/types';
import useEditContractStatus from '../data-access-contract-form/useEditContractStatus';
import useFormModal from '@ui/shared/modal/form-modal/useFormModal';
import { useRef, useState } from 'react';
import ContractResolutionDateForm from '../feature-contract-form/ContractResolutionDateForm';
import { useDrag } from 'react-dnd';

const contractInProgressGroup: ContractStatus[] = [
  ContractStatus.carInspection,
  ContractStatus.priceNegotiation,
  ContractStatus.contractDraft,
];
const contractOutcomeGroup: ContractStatus[] = [
  ContractStatus.contractSuccessful,
  ContractStatus.contractFailed,
];

const useContractDrag = (data: ContractType, status: ContractStatus) => {
  const { mutateAsync: editContractStatusAsync } = useEditContractStatus();
  const { openFormModal, closeFormModal } = useFormModal();
  const [isLoading, setIsLoading] = useState(false);
  const dragRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: data.id },
    end: async (item, monitor) => {
      setIsLoading(true);
      try {
        const dropResult = monitor.getDropResult<{ name: ContractStatus }>();
        console.log(
          '🖱️ 드래그 종료 - dropResult:',
          dropResult,
          '현재 상태:',
          status
        );

        if (!dropResult) return;
        if (dropResult.name === status) return;

        const prevStatus = status;
        const newStatus = dropResult.name;

        console.log('🔄 상태 변경 시도:', { prevStatus, newStatus });

        // [수정] DB 값(대문자)과 프론트 값(카멜케이스) 형식이 다를 경우를 대비한 매핑
        // ContractStatus의 실제 값에 맞춰서 비교해야 합니다.
        // 임시로 대소문자 구분 없이 비교하거나, 매핑 테이블을 사용하는 것이 좋습니다.
        const isInGroup = (group: ContractStatus[], status: string) => {
          return group.some(
            (s) =>
              s === status ||
              s.toString().toUpperCase() ===
                status.toUpperCase().replace(/_/g, '')
          );
        };

        const isPrevInProgress = isInGroup(contractInProgressGroup, prevStatus);
        const isNewInProgress = isInGroup(contractInProgressGroup, newStatus);
        const isPrevOutcome = isInGroup(contractOutcomeGroup, prevStatus);
        const isNewOutcome = isInGroup(contractOutcomeGroup, newStatus);

        console.log('🔍 그룹 체크:', {
          isPrevInProgress,
          isNewInProgress,
          isPrevOutcome,
          isNewOutcome,
        });

        if (isPrevInProgress && isNewInProgress) {
          await editContractStatusAsync({
            id: item.id,
            data: { status: newStatus },
            prevStatus,
          });
        } else if (isPrevInProgress && isNewOutcome) {
          openFormModal({
            title: `계약 ${newStatus === ContractStatus.contractSuccessful ? '성공' : '실패'} 등록`,
            form: (
              <ContractResolutionDateForm
                onCancel={closeFormModal}
                onSubmit={async (data) => {
                  closeFormModal();
                  const { resolutionDate } = data;
                  await editContractStatusAsync({
                    id: item.id,
                    data: { status: newStatus, resolutionDate },
                    prevStatus,
                  });
                }}
                type={newStatus}
                // eslint-disable-next-line react/jsx-closing-bracket-location
              />
            ),
          });
        } else if (isPrevOutcome && isNewInProgress) {
          await editContractStatusAsync({
            id: item.id,
            data: { status: newStatus, resolutionDate: null },
            prevStatus,
          });
        } else if (isPrevOutcome && isNewOutcome) {
          return;
        }
      } finally {
        setIsLoading(false);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(dragRef);

  return { dragRef, isDragging, isLoading };
};

export default useContractDrag;
