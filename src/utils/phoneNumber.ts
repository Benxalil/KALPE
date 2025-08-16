export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as XX XXX XX XX
  const match = digits.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return digits;
};