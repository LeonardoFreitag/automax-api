const OnlyText = (text: string): string => {
  // const str = 'ÁÉÍÓÚáéíóúâêîôûàèìòùÇç';
  const parsed = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return parsed;
};

export default OnlyText;
