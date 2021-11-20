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


