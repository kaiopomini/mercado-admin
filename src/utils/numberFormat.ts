export function toCurrency(value: number) {
    const newValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .format(value);

      return newValue
}

export const rightToLeftFormatter = (value: string) => {
  if (!Number(value)) return '';

  let amount = '';
  if (amount.length > 2) {
    amount = parseInt(value).toFixed(2);
  } else {
    amount = (parseInt(value) / 100).toFixed(2);
  }

  return `${amount}`;
};

