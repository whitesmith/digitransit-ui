export const calcPercentageDiff = (userSum, average) => Math.round((userSum * 100) / average) - 100;


export const getStatAmount = (amount, smallUnit, bigUnit) => {
  const invalidAmount = !amount || isNaN(amount);

  let decimal = false;
  let unitToShow = '';
  let amountToShow = 0;
  
  if(!invalidAmount) {
    decimal = amount > 999;
    unitToShow = decimal ? bigUnit : smallUnit;
    amountToShow = decimal ? Math.round(amount / 10) / 100 : Math.round(amount);
  }

  return {
    amount: amountToShow,
    unit: unitToShow,
    invalid: invalidAmount
  }
}

export const getStatAverage = (percentage, inverted, intl) => {
  const labelAboveAverage = intl.formatMessage({
    id: 'above-average',
    defaultMessage: 'above average',
  });
  const labelBelowAverage = intl.formatMessage({
    id: 'below-average',
    defaultMessage: 'below average',
  });
  const averageCompare = 
    (percentage > 0) ? labelAboveAverage : labelBelowAverage;
  const averageClass = 
    (percentage > 0) ? 
      (inverted) ? 'negative' : 'positive'
    : 
      (inverted) ? 'positive': 'negative';

  return {
    class: averageClass,
    percentage: Math.abs(percentage),
    label: averageCompare
  }
} 