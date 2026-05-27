// Avro Phonetic Transliteration Engine in pure JS (safe for Vite/Webpack)

const rules = [
  { match: 'kriddho', replace: 'ক্রুদ্ধ' },
  { match: 'punormiloni', replace: 'পুনর্মিলনী' },
  { match: 'onusthan', replace: 'অনুষ্ঠান' },
  { match: 'barshik', replace: 'বার্ষিক' },
  { match: 'alumni', replace: 'অ্যালামনাই' },
  { match: 'prothom', replace: 'প্রথম' },
  { match: 'bengali', replace: 'বাঙালি' },
  { match: 'bangla', replace: 'বাংলা' },
  { match: 'dhaka', replace: 'ঢাকা' },
  { match: 'shob', replace: 'সব' },
  { match: 'kichu', replace: 'কিছু' },
  { match: 'karim', replace: 'করিম' },
  { match: 'rahman', replace: 'রহমান' },
];

export const convertBanglishToBengali = (text) => {
  if (!text) return '';

  let words = text.split(/\s+/);
  let convertedWords = words.map(word => {
    let lowerWord = word.toLowerCase();

    // Check fixed rules first
    const foundRule = rules.find(r => r.match === lowerWord);
    if (foundRule) return foundRule.replace;

    // Direct transliteration phonetic rules mapping
    let result = word
      .replace(/aa/g, 'া')
      .replace(/oi/g, 'ৈ')
      .replace(/ou/g, 'ৌ')
      .replace(/kh/g, 'খ')
      .replace(/gh/g, 'ঘ')
      .replace(/ch/g, 'চ')
      .replace(/c/g, 'চ')
      .replace(/jh/g, 'ঝ')
      .replace(/j/g, 'জ')
      .replace(/th/g, 'থ')
      .replace(/t/g, 'ত')
      .replace(/ph/g, 'ফ')
      .replace(/p/g, 'প')
      .replace(/bh/g, 'ভ')
      .replace(/b/g, 'ব')
      .replace(/sh/g, 'শ')
      .replace(/s/g, 'স')
      .replace(/h/g, 'হ')
      .replace(/r/g, 'র')
      .replace(/l/g, 'ল')
      .replace(/m/g, 'ম')
      .replace(/n/g, 'ন')
      .replace(/k/g, 'ক')
      .replace(/g/g, 'গ')
      .replace(/d/g, 'দ')
      .replace(/dh/g, 'ধ')
      .replace(/i/g, 'ি')
      .replace(/u/g, 'ু')
      .replace(/e/g, 'ে')
      .replace(/o/g, 'ো')
      .replace(/a/g, 'া');

    // Make sure we prefix with leading character if it started with a vowel
    if (/^[aeiou]/i.test(word)) {
      const firstChar = word[0].toLowerCase();
      let vowelPrefix = 'অ';
      if (firstChar === 'a') vowelPrefix = 'আ';
      if (firstChar === 'i') vowelPrefix = 'ই';
      if (firstChar === 'u') vowelPrefix = 'উ';
      if (firstChar === 'e') vowelPrefix = 'এ';
      if (firstChar === 'o') vowelPrefix = 'ও';
      
      result = vowelPrefix + result.substring(1);
    }

    return result;
  });

  return convertedWords.join(' ');
};
