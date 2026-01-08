// @ts-nocheck
import axios from 'axios';

export async function uploadCustomerFile(
  file: File,
  token: string
): Promise<UploadCustomerResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UploadCustomerResponse>(
      '/api/customers/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        throw new Error('잘못된 요청입니다');
      }
      if (status === 401) {
        throw new Error('로그인이 필요합니다');
      }
    }

    throw new Error('고객 업로드에 실패했습니다');
  }
}
