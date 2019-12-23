const path = require('path');
const fs = require('fs');
const csv2jsonfile = require('../dist/index');

const sourcePath = path.resolve(__dirname, 'data.csv');
const targetPath = path.resolve(__dirname, 'result.json');

describe('test csv2jsonfile', () => {
  test('test can convert correct', () => {
    return csv2jsonfile(sourcePath, targetPath)
      .then((time) => {
        expect(time).toBeGreaterThanOrEqual(0);
        expect(fs.existsSync(targetPath)).toBeTruthy();
      });
  });
  test('test can convert to JavaScript Object correct', () => {
    let expectedObj = [
      {
        city: 'Shanghai',
        level: '3',
        alias: 'SH',
      },
      {
        city: 'Chongqing',
        level: '3',
        alias: 'CQ',
      },
      {
        city: 'Jinan',
        level: '4',
        alias: 'JN',
      },
    ];
    return csv2jsonfile.inline(sourcePath)
      .then((obj) => {
        expect(obj).toEqual(expectedObj);
      });
  });
});
