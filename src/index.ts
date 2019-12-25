const readline = require('readline')
const fs = require('fs')
import { newLine, space2, space4 } from './const'

function _lineRenderWithHeader(line: string[], headers: string[]) {
  let rows: string[] = []
  rows.push(`${space2}{${newLine}`)
  const len = line.length
  line.forEach((item, index) => {
    rows.push(`${space4}"${headers[index]}": "${item}"${index === len - 1 ? '' : ','}${newLine}`)
  })
  rows.push(`${space2}}`)
  return rows
}

function _lineRenderWithoutHeader(line: string[]) {
  let content: string = `${space2}[`
  const len = line.length
  line.forEach((item, index) => {
    content += `"${item}"${index === len - 1 ? '' : ','}`
  })
  content += ']'
  return content
}

function renderLine(line: string, firstLine: boolean, headers?: string[]): string[] {
  let rows: string[] = []
  if (!firstLine) {
    rows.push(`,${newLine}`)
  }
  const list = line.split(',')
  if (headers) {
    rows.push(..._lineRenderWithHeader(list, headers))
  } else {
    rows.push(_lineRenderWithoutHeader(list))
  }
  return rows
}

function renderLineInline(line: string, headers?: string[]): string {
  let result: string = ''
  const list = line.split(',')
  const len = list.length
  list.forEach((item, index) => {
    if (headers) {
      result += `"${headers[index]}": "${item}"${index === len - 1 ? '' : ','}`
    } else {
      result += `"${item}"${index === len - 1 ? '' : ','}`
    }
  })
  return result
}

interface Options {
  header: boolean
  [key: string]:  any
}

function csv2json(sourcePath: string, targetPath: string, options: Options = { header: true }) {
  return new Promise((resolve, reject) => {
    const exists = fs.existsSync(sourcePath)
    if (!exists) {
      throw new Error(`${sourcePath} file does not exist.`)
    }
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }
    const start = +new Date()
    const fRead = fs.createReadStream(sourcePath)
    fRead.on('end', () => {
      setTimeout(() => {
        fs.appendFileSync(targetPath, `${newLine}]`)
        resolve(Date.now() - start)
      }, 0)
    })
    fs.appendFileSync(targetPath, `[${newLine}`); // add the tag to the left side of the array container
    const rl = readline.createInterface({
      input: fRead
    })
    const { header } = options
    let lineIndex = header ? 0 : 1
    let headerList: string[]
    rl.on('line', line => {
      let rows: string[] = []
      if(lineIndex === 0) {
        headerList = line.split(',')
      } else {
        rows = renderLine(line, lineIndex === 1, headerList)
      }
      for (const row of rows) {
        fs.appendFileSync(targetPath, row)
      }
      lineIndex += 1
    })
  })
}

function csv2inlineJson(sourcePath: string, options: Options = { header: true }) {
  return new Promise((resolve, reject) => {
    const isExists = fs.existsSync(sourcePath)
    if (!isExists) {
      throw new Error(`${sourcePath} file does not exist.`)
    }
    let result = ''
    const fRead = fs.createReadStream(sourcePath)
    fRead.on('end', () => {
      setTimeout(() => {
        result += ']'
        resolve(JSON.parse(result))
      }, 0);
    })
    const rl = readline.createInterface({ input: fRead })
    const { header } = options
    let columnIndex = header ? 0 : 1
    const bracket = header ? '{}' : '[]'
    let headerList: string[]
    result += '['
    rl.on('line', (line: string) => {
      if (columnIndex === 0) {
        headerList = line.split(',')
      } else {
        result += `${columnIndex === 1 ? '' : ','}${bracket[0]}`
        result += renderLineInline(line, headerList)
        result += bracket[1]
      }
      columnIndex += 1
    })
  })
}

csv2json.inline = csv2inlineJson

export default csv2json
