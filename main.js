// There is the following content in the input.txt file:
//
// ```
// первый второй третий четвёртый пятый
// шестой седьмой восьмой девятый десятый
//
// први други трећи четврти пети
// шести седми осми девети десети
// ```
//
// We parse it with node.js, read both paragraphs, replace all space characters with empty lines and make the first paragraph a first column in a csv file called output.csv, and the second one as a second column. Use  as a separator. Also, for the second paragraph which is in serpski language I want to use latin notation.
//
// I also want to preserve the content of output.csv in order to save the previously added content.

require("dotenv").config();

/** @param {string} input */
function serbianCyrillicToLatin(input) {
  const map = {
    "\\s\\(м\\)": " (m)",
    "\\s\\(ж\\)": " (f)",
    "\\s\\(с\\)": " (n)",
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    ђ: "đ",
    е: "e",
    ж: "ž",
    з: "z",
    и: "i",
    ј: "j",
    к: "k",
    л: "l",
    љ: "lj",
    м: "m",
    н: "n",
    њ: "nj",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    ћ: "ć",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "č",
    џ: "dž",
    ш: "š",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Ђ: "Đ",
    Е: "E",
    Ж: "Ž",
    З: "Z",
    И: "I",
    Ј: "J",
    К: "K",
    Л: "L",
    Љ: "Lj",
    М: "M",
    Н: "N",
    Њ: "Nj",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    Ћ: "Ć",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Č",
    Џ: "Dž",
    Ш: "Š",
  };
  // go through the map and replace all the keys with values
  let result = input;
  for (const key in map) {
    result = result.replace(new RegExp(key, "g"), map[key]);
  }
  return result;
}

/** @param {string} input */
function serbianCyrillicToTranscript(input) {
  const map = {
    ве: "вэ",
    не: "нэ",
    де: "дэ",
    ме: "мэ",
    ре: "рэ",
    фе: "фэ",
    це: "цэ",
    те: "тэ",
    се: "сэ",
    пе: "пэ",
    ше: "шэ",
    ле: "лэ",
    ђ: "дж",
    ње: "не",
    ље: "ле",
    ља: "ля",
    њ: "н",
    љ: "л",
    џ: "ж",
    ћ: "ч",
    аj: "ай",
    иj: "ий",
    оj: "ой",
    jу: "ю",
    jа: "я",
    jе: "е",
    jи: "йи",
    "\\s\\(м\\)": "",
    "\\s\\(ж\\)": "",
    "\\s\\(с\\)": "",
  };

  // go through the map and replace all the keys with values
  let result = input;
  for (const key in map) {
    result = result.replace(new RegExp(key, "g"), map[key]);
  }
  return result;
}

const INPUT_SEPARATOR = "\n";

function createCsvRecordArray(input) {
  return (
    input
      .split(INPUT_SEPARATOR)
      // remove null and tab characters
      .map((item) => item.replace(/\0|\t/g, ""))
      // replace new line characters with space
      .map((item) => item.replace(/\r?\n|\r/g, " "))
      .map((item) => item.trim())
      .filter((item) => item)
  );
}

const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const INPUT_FILE_NAME = `${process.env.FILE_NAME}.txt`;
const OUTPUT_FILE_NAME = `${INPUT_FILE_NAME.split(".")[0]}.csv`;

// Read the contents of the input file
fs.readFile(INPUT_FILE_NAME, "utf8", (err, data) => {
  if (err) throw err;

  // Split the data into two paragraphs
  const [paragraph1, paragraph2] = data.split("\n\n");

  // Replace space characters with empty lines
  const formattedColumn1 = createCsvRecordArray(serbianCyrillicToLatin(paragraph2));
  const formattedColumn2 = createCsvRecordArray(serbianCyrillicToTranscript(paragraph2));
  const formattedColumn3 = createCsvRecordArray(paragraph1);

  console.log("formattedColumn1", formattedColumn1);
  console.log("formattedColumn2", formattedColumn2);
  console.log("formattedColumn3", formattedColumn3);

  if (
    formattedColumn1.length !== formattedColumn2.length ||
    formattedColumn2.length !== formattedColumn3.length
  ) {
    throw new Error("The number of records in the columns is not equal!");
  }

  // Create a CSV writer
  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE_NAME,
    header: ["column1", "column2", "column3"],
    append: false,
    fieldDelimiter: ";",
    recordDelimiter: "\n",
  });

  // transform columns into records
  const records = formattedColumn1.map((item, index) => ({
    column1: formattedColumn1[index],
    column2: formattedColumn2[index],
    column3: formattedColumn3[index],
  }));

  // Write the formatted data to the CSV file
  csvWriter.writeRecords(records).then(() => {
    console.log(`...Done`);
  });
});
