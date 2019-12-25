const path = require('path');
const fs = require('fs');
import csv2jsonfile from '../src/index'

const sourcePath = path.resolve(__dirname, 'data.csv');
const targetPath = path.resolve(__dirname, 'result.json');
const targetPath1 = path.resolve(__dirname, 'result1.json')

describe('test csv2jsonfile with header', () => {
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

describe('test csv2jsonfile without header', () => {
  test('csv2json', () => {
    return csv2jsonfile(sourcePath, targetPath1, { header: false })
      .then(time => {
        expect(time).toBeGreaterThanOrEqual(0);
        expect(fs.existsSync(targetPath1)).toBeTruthy();
      })
  })
  test('inline csv2json without header', () => {
    const expected = [
      ['city','level','alias'],
      ['Shanghai', '3', 'SH'],
      ['Chongqing', '3', 'CQ'],
      ['Jinan', '4', 'JN']
    ]
    return csv2jsonfile.inline(sourcePath, { header: false })
      .then((obj) => {
        expect(obj).toEqual(expected);
      });
  });
})


describe('test exceptions', () => {
  test('target file does not exist.', () => {
    csv2jsonfile(path.resolve(__dirname, 'notexistfilename.csv'))
      .catch((error) => {
        expect(error.message).toMatch(/does not exist/)
      })
  })
  test('target file does not exist.', () => {
    csv2jsonfile.inline(path.resolve(__dirname, 'notexistfilename.csv'))
      .catch((error) => {
        expect(error.message).toMatch(/does not exist/)
      })
  })
})