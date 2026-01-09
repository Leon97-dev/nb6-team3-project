import classNames from 'classnames/bind';
import styles from './ContractPriceEditForm.module.scss';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ContractType } from '@shared/types';
import FieldLabel from '@ui/shared/input/FieldLabel/FieldLabel';
import Button from '@ui/shared/button/Button';
import TextField from '@ui/shared/input/TextField/TextField';

const cx = classNames.bind(styles);

type ContractPriceEditFormProps = {
  onSubmit: (data: Pick<ContractType, 'contractPrice'>) => void;
  onCancel: () => void;
  defaultContractPrice?: number;
};

type ContractPriceFormValues = {
  contractPrice?: number | null;
};

const ContractPriceEditForm = ({
  onSubmit,
  onCancel,
  defaultContractPrice,
}: ContractPriceEditFormProps) => {
  const methods = useForm<ContractPriceFormValues>({
    defaultValues: { contractPrice: defaultContractPrice },
  });
  const { setValue, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className={cx('container')}
        onSubmit={handleSubmit(({ contractPrice }) => {
          // 빈칸이면 0원으로 저장
          const nextPrice =
            contractPrice === undefined || contractPrice === null
              ? 0
              : contractPrice;
          onSubmit({ contractPrice: nextPrice });
        })}
      >
        <div className={cx('input')}>
          <FieldLabel label="가격" required />
          <Controller
            name="contractPrice"
            rules={{
              required: '필수 입력사항입니다.',
              validate: (value) =>
                value === undefined || value === null || Number(value) >= 0
                  ? true
                  : '유효하지 않은 값입니다.',
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                placeholder="가격을 입력해 주세요"
                value={field.value ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;

                  if (raw === '') {
                    // 완전 삭제 -> 빈 문자열 유지, 내부 값은 undefined
                    setValue('contractPrice', undefined, {
                      shouldValidate: true,
                    });
                    field.onChange('');
                    return;
                  }

                  const value = Number(raw);
                  const nextValue = Number.isNaN(value) ? undefined : value;

                  setValue('contractPrice', nextValue, {
                    shouldValidate: true,
                  });
                  field.onChange(raw);
                }}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div className={cx('buttonContainer')}>
          <Button onClick={onCancel} type="button" size="small" theme="gray">
            취소
          </Button>
          <Button type="submit" size="small" theme="red">
            수정
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContractPriceEditForm;
