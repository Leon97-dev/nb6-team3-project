export default function formatDashboardMoney(value: number | undefined | null) {
  const units = [
    { unit: '만', value: 10000 },
    { unit: '억', value: 100000000 },
    { unit: '조', value: 1000000000000 },
    { unit: '경', value: 10000000000000000 },
  ];

  for (
    let checkingIndex = units.length - 1;
    checkingIndex >= 0;
    checkingIndex--
  ) {
    if (value === undefined || value === null) {
      return '0원';
    }

    return `${value.toLocaleString()}원`;
  }
}
