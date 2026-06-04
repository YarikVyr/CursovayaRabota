/* global describe, it, expect */

const formatRepresentativeName = (value, inputType = '') => {
  const text = String(value || '');
  if (!text.trim()) return '';
  if (inputType.startsWith('delete')) return text;

  const normalizedText = text.trimStart();
  const letters = [];
  let secondLetterIndex = -1;

  for (let index = 0; index < normalizedText.length; index += 1) {
    if (/\p{L}/u.test(normalizedText[index])) {
      letters.push(normalizedText[index].toUpperCase());

      if (letters.length === 2) {
        secondLetterIndex = index;
        break;
      }
    }
  }

  if (letters.length === 0) return '';
  if (letters.length === 1) return letters[0];

  const surname = normalizedText.slice(secondLetterIndex + 1).replace(/^[\s.]+/, '');
  const formattedSurname = surname
    ? `${surname[0].toUpperCase()}${surname.slice(1)}`
    : '';

  return `${letters[0]}.${letters[1]}.${formattedSurname ? ` ${formattedSurname}` : ' '}`;
};

describe('Бизнес-логика компонента лист согласования', () => {
  
  it('должен автоматически приводить инициалы и фамилию к верхнему регистру при вводе', () => {
    const rawInput = 'а.п. николаев';
    
    const formattedResult = formatRepresentativeName(rawInput);
    
    expect(formattedResult).toContain('А.П.'); 
  });

  it('должен корректно обрабатывать пустую строку', () => {
    const formattedResult = formatRepresentativeName('');
    expect(formattedResult).toBe('');
  });
});