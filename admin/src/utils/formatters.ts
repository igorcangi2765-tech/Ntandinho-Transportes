/**
 * Formatação Global de Moeda e Valores para o N'Tandinho ERP
 * Padrão Obrigatório de Moçambique: Meticais (MZN) por extenso/completo sem abreviações k/M.
 * Exemplo: 642000 -> "642 000,00 MZN"
 */

export const formatCurrencyMzn = (value: number | undefined | null): string => {
  const amount = value || 0;
  
  // Format with space integer thousand separator and comma for decimals
  const parts = amount.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const decimalPart = parts[1];

  return `${integerPart},${decimalPart} MZN`;
};

export const formatNumberInteger = (value: number | undefined | null): string => {
  const amount = value || 0;
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const getMozambiqueGreeting = (userName: string): string => {
  const hour = new Date().getHours();
  let greeting = 'Bom dia';
  if (hour >= 12 && hour < 18) {
    greeting = 'Boa tarde';
  } else if (hour >= 18 || hour < 5) {
    greeting = 'Boa noite';
  }
  
  // Clean first name
  const firstName = userName ? userName.split(' ')[0] : 'Sérgio';
  return `${greeting}, ${firstName}.`;
};
