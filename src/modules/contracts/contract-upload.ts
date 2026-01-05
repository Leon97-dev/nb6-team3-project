import { error } from 'console';
import { file } from 'zod';

async function uploadContractDocument(file: File, token: string) {
  const formData = new FormData();
  formData.append('contractDocument', file, token);

  const response = await fetch('/api/contracts.document', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('로그인이 필요합니다');
    }
    throw new Error('계약서 업로드 실패');
  }

  return response.json();
}
