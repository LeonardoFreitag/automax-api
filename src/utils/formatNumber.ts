const formatNumber = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(value);

export default formatNumber;
