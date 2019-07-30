const readline = require('readline');
const fs = require('fs');
const os = require('os');

const space2 = '  ';
const space4 = space2 + space2;
const newLine = os.EOL;

function lineRenderWithHeaders(line, headers, isFirstLine) {
  let rows = [];
  if(!isFirstLine) {
    rows.push(`,${newLine}`); // add ',' first
  }
  rows.push(`${space2}{${newLine}`);
  let list = line.split(',');
  const len = list.length;
  list.forEach((item, index) => {
    rows.push(`${space4}"${headers[index]}": "${item}"${index === len - 1 ? '' : ','}${newLine}`);
  });
  rows.push(`${space2}}`);
  return rows;
}

function lineRenderWithoutHeaders(line, isFirstLine) {
  let rows = [];
  if (!isFirstLine) {
    rows.push(`,${newLine}`);
  }
  let content = `${space2}[`;
  // rows.push(`${space2}{${newLine}`);
  let list = line.split(',');
  const len = list.length;
  list.forEach((item, index) => {
    // rows.push(`${space4}"${headers[index]}": "${item}"${index === len - 1 ? '' : ','}${newLine}`);
    content += `"${item}"${index === len - 1 ? '' : ','}`;
  });
  content += ']';
  rows.push(content);
  return rows;
}

/**
 * convert csv to json
 * @param {string} sourcePath absolute path of csv file 
 * @param {string} targetPath absolute path of json file
 * @param {object} options options { header: true }
 */
function csv2json(sourcePath, targetPath, { header = true } = {}) {
  return new Promise((resolve, reject) => {
    const isExists = fs.existsSync(sourcePath);
    if (!isExists) {
      reject(new Error(`${sourcePath} file does not exist.`));
    }
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    const startTimestamp = +new Date();
    const fRead = fs.createReadStream(sourcePath);
    fRead.on('end', () => {
      // bug fix: end of line if no '\n';
      setTimeout(() => {
        fs.appendFileSync(targetPath, `${newLine}]`);
        resolve(Date.now() - startTimestamp);
      },0);
    });
    const rl = readline.createInterface({
      input: fRead,
    });
    let columnIndex = header ? 0 : 1;
    let keysList;
    fs.appendFileSync(targetPath, `[${newLine}`); // add the tag to the left side of the array container
    rl.on('line', (line) => {
      let rows = [];
      if (columnIndex === 0) {
        // 第一行获取key
        keysList = line.split(',');
      } else if (columnIndex === 1) {
        rows = header ? lineRenderWithHeaders(line, keysList, true) : lineRenderWithoutHeaders(line, true);
      } else {
        rows = header ? lineRenderWithHeaders(line, keysList, false) : lineRenderWithoutHeaders(line, false);
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
function csv2jsoninline(sourcePath, { header = true } = {}) {
  return new Promise((resolve, reject) => {
    const isExists = fs.existsSync(sourcePath);
    if (!isExists) {
      reject(new Error(`${sourcePath}file does not exist.`));
    }
    let result = '';
    const fRead = fs.createReadStream(sourcePath);
    fRead.on('end', () => {
      // bug fix: end of line if no '\n';
      setTimeout(() => {
        result += ']';
        resolve(JSON.parse(result));
      });
    });
    const rl = readline.createInterface({
      input: fRead,
    });
    let columnIndex = header ? 0 : 1;
    const bracket = header ? "{}" : "[]";
    let keysList;
    result += '[';
    rl.on('line', (line) => {
      if (columnIndex === 0) {
        // 第一行获取key
        keysList = line.split(',');
      } else {
        result += `${columnIndex === 1 ? '' : ','}${bracket[0]}`;
        let list = line.split(',');
        let len = list.length;
        list.forEach((item, index) => {
          if (header) {
            result += `"${keysList[index]}": "${item}"${index === len - 1 ? '' : ','}`;
          } else {
            result += `"${item}"${index === len - 1 ? '' : ','}`;
          }
        });
        result += bracket[1];
      }
      columnIndex += 1;
    });
  });
}

csv2json.inline = csv2jsoninline;

module.exports = csv2json;
