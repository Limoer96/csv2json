# csv2jsonfile

[![Build Status](https://travis-ci.com/xiaomoer/csv2json.svg?branch=master)](https://travis-ci.com/xiaomoer/csv2json)![Codecov](https://img.shields.io/codecov/c/github/xiaomoer/csv2json)![npm](https://img.shields.io/npm/dm/csv2jsonfile)![npm bundle size](https://img.shields.io/bundlephobia/min/csv2jsonfile)

> A Tool convert CSV to JSON or JS Object with NO Dependencies.

## Install

```bash
npm install --save csv2jsonfile
```
or
```bash
yarn add csv2jsonfile
```
see from [npm package](https://npmjs.org/package/csv2jsonfile).

## Usage

> note: the csv file must have header(used as key), like the example below:
```
city,level,alias
Shanghai,3,SH
Chongqing,3,SQ
Jinan,4,JN 
```

### CSV to JSON
```javascript
const csv2jsonfile = require('csv2jsonfile');
const path = require('path');
const sourcePath = path.resolve(__dirname, 'data.csv'); 
const targetPath = path.resolve(__dirname, 'result.json');

// default convert CSV with header
csv2jsonfile(sourcePath, targetPath)
  .then((time) => {
    console.log(`use: ${time} ms`);
  })
  .catch((err) => {
    console.log(err.message);
  })
// result in result.json
/*
[
  {
    city: "Shangehai",
    level: "3",
    alias: "SH"
  },
  {
    city: "Chongqing",
    level: "3",
    alias: "CQ"
  },
]
*/
// CSV without header
csv2jsonfile(sourcePath, targetPath, { header: false })
  .then((time) => {
    console.log(`use: ${time} ms`);
  })
  .catch((err) => {
    console.log(err.message);
  })
```

### CSV to JavaScript Object

```javascript
var csv2jsonfile = require('csv2jsonfile');
csv2jsonfile.inline('data.csv')
  .then((obj) => {
    console.log(obj)
  })
  .catch((err) => {
    console.log(err);
  })
// CSV without header
csv2jsonfile.inline('data.csv', { header: false })
  .then((obj) => {
    console.log(obj);
  })
  .catch((err) => {
    console.log(err);
  })
```
## API

```javascript
/**
 * convert csv to json file
 * @param {string} sourcePath absolute path of csv file 
 * @param {string} targetPath absolute path of json file
 * @param {object} options default { header: true }
 * @return {Promise} ms usage through convert progress
 */
csv2jsonfile(sourcePath, targetPath, options?)

/**
 *  convert csv to javascript object
 * @param {string} sourcePath absolute path of csv file
 * @param {object} options default { header: true }
 * @return {Promise} the object after convert
 */
csv2jsonfile.inline(sourcePath, options?)
```
## ChangeLog

### v1.2.0
1. Delete `targetPath` file if it exists before convert.(no need to manuallt clear)
2. add **No Header** CSV support.

If the CSV without header, It will be converted into **Array** each line.
E.g:

```javascript
// data.csv => data.json
// 1. without header
[
  ["Shanghai", "3", "SH"],
  ["Chongqing", "3", "CQ"],
  ["Jinan", "4", "JN"]
]
// with header
[
  {
    "city": "Shanghai",
    "level": "3",
    "alias": "SH"
  },
  {
    "city": "Chongqing",
    "level": "3",
    "alias": "CQ"
  },
  {
    "city": "Jinan",
    "level": "4",
    "alias": "JN"
  }
]
```
3. fix bug: if there are no new empty line(`\n`) at the end of the file, may cause confusion.
