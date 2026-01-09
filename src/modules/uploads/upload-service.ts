export const uploadService = {
  async getUploadUrl(
    file: Express.Multer.File | undefined,
    baseUrl = ''
  ): Promise<string | null> {
    if (!file) {
      return null;
    }

    const normalizedBaseUrl =
      baseUrl && !baseUrl.startsWith('http') ? `http://${baseUrl}` : baseUrl;
    const prefix = normalizedBaseUrl
      ? normalizedBaseUrl.replace(/\/+$/, '')
      : '';

    return `${prefix}/upload/${file.filename}`;
  },
};
