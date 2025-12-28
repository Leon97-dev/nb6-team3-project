export const validateCreateCar = (body: any) => {
  const requiredFields = [
    'carNumber',
    'manufacturer',
    'model',
    'manufacturingYear',
    'mileage',
    'price',
    'accidentCount',
  ];

  for (const field of requiredFields) {
    if (body[field] === undefined) {
      throw new Error('잘못된 요청입니다');
    }
  }
};
