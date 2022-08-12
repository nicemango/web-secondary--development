import numeral from 'numeral';

export const format = n => numeral(n).format('0[.]0a');
