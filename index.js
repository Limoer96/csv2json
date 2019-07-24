const readline = require('readline');
const path = require('path');
const fs = require('fs');
const os = require('os');

const space2 = '  ';
const space4 = space2 + space2;
const newLine = os.EOL;
/**
 * convert csv to json
 * @param {string} sourcePath absolute path of csv file 
 * @param {string} targetPath absolute path of json file
 */
function csv2json(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    const isExists = fs.existsSync(sourcePath);
    if (!isExists) {
      reject(new Error(`${sourcePath} file does not exist.`));
    }
    const startTimestamp = +new Date();
    const fRead = fs.createReadStream(sourcePath);
    fRead.on('end', () => {
      fs.appendFileSync(targetPath, `${newLine}]`);
      resolve(Date.now() - startTimestamp);
    });
    const rl = readline.createInterface({
      input: fRead,
    });
    let columnIndex = 0;
    let keysList;
    fs.appendFileSync(targetPath, `[${newLine}`); // add the tag to the left side of the array container
    rl.on('line', (line) => {
      let rows = [];
      if (columnIndex === 0) {
        // 第一行获取key
        keysList = line.split(',');
      } else if (columnIndex === 1) {
        rows.push(`${space2}{${newLine}`);
        let list = line.split(',');
        const len = list.length;
        list.forEach((item, index) => {
          rows.push(`${space4}"${keysList[index]}": "${item}"${index === len - 1 ? '' : ','}${newLine}`);
        });
        rows.push(`${space2}}`);
      } else {
        rows.push(`,${newLine}`); // add ',' first
        rows.push(`${space2}{${newLine}`);
        let list = line.split(',');
        const len = list.length;
        list.forEach((item, index) => {
          rows.push(`${space4}"${keysList[index]}": "${item}"${index === len - 1 ? '' : ','}${newLine}`);
        });
        rows.push(`${space2}}`);
      }
      for (let row of rows) {
        fs.appendFileSync(targetPath, row);
      }
      columnIndex += 1;
    });
  })
}
/**
 *  convert csv to javascript object
 * @param {string} sourcePath absolute path of csv file 
 */
function csv2jsoninline(sourcePath) {
  return new Promise((resolve, reject) => {
    const isExists = fs.existsSync(sourcePath);
    if (!isExists) {
      reject(new Error(`${sourcePath}file does not exist.`));
    }
    let result = '';
    const fRead = fs.createReadStream(sourcePath);
    fRead.on('end', () => {
      result += ']';
      resolve(JSON.parse(result));
    });
    const rl = readline.createInterface({
      input: fRead,
    });
    let columnIndex = 0;
    let keysList;
    result += '[';
    rl.on('line', (line) => {
      if (columnIndex === 0) {
        // 第一行获取key
        keysList = line.split(',');
      } else {
        result += `${columnIndex === 1 ? '' : ','}{`;
        let list = line.split(',');
        let len = list.length;
        list.forEach((item, index) => {
          result += `"${keysList[index]}": "${item}"${index === len - 1 ? '' : ','}`;
        });
        result += '}';
      }
      columnIndex += 1;
    });
  });
}

csv2json.inline = csv2jsoninline;

module.exports = csv2json;
