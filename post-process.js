require("dotenv").config();
const fs = require('fs');

// А́а́, Е́е́, И́и́, О́о́, У́у́, Ы́ы́, Э́э́, Ю́ю́, Я́я́
function convertToAccented(word) {
  const accentsMap = {
    'А': 'а́',
    'Б': 'б',
    'В': 'в',
    'Г': 'г',
    'Д': 'д',
    'Е': 'е́',
    'Ё': 'ё',
    'Ж': 'ж',
    'З': 'з',
    'И': 'и́',
    'Й': 'й',
    'К': 'к',
    'Л': 'л',
    'М': 'м',
    'Н': 'н',
    'О': 'о́',
    'П': 'п',
    'Р': 'р',
    'С': 'с',
    'Т': 'т',
    'У': 'у́',
    'Ф': 'ф',
    'Х': 'х',
    'Ц': 'ц',
    'Ч': 'ч',
    'Ш': 'ш',
    'Щ': 'щ',
    'Ъ': 'ъ',
    'Ы': 'ы́',
    'Ь': 'ь',
    'Э': 'э́',
    'Ю': 'ю́',
    'Я': 'я́'
  };

  const convertedWord = word.split('').map(char => {
    if (char in accentsMap) {
      return accentsMap[char];
    }
    return char;
  }).join('');

  return convertedWord;
}

const inputFile = `${process.env.FILE_NAME}.csv`;
const outputFile = `${inputFile.split('.')[0]}.processed.csv`

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Разделение данных на строки
  const lines = data.split('\n');

  // Обработка и преобразование данных
  const convertedLines = lines.map(line => {
    const columns = line.split(';');
    if (columns.length >= 3) {
      columns[1] = convertToAccented(columns[1]);
    }
    return columns.join(';');
  });

  // Запись результата в новый файл
  fs.writeFile(outputFile, convertedLines.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Обработанные данные сохранены в', outputFile);
  });
});