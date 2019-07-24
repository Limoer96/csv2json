# csv2jsonfile

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
```
## API

```javascript
/**
 * convert csv to json file
 * @param {string} sourcePath absolute path of csv file 
 * @param {string} targetPath absolute path of json file
 * @return {Promise} ms usage through convert progress
 */
csv2jsonfile(sourcePath, targetPath)

/**
 *  convert csv to javascript object
 * @param {string} sourcePath absolute path of csv file
 * @return {Promise} the object after convert
 */
csv2jsonfile.inline(sourcePath)
```