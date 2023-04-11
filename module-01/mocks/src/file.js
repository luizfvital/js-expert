const { readFile } = require('fs/promises')
const { error } = require('./constants')

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ['id','name','profession','age'],
}

class File {
  static async csvToJSON(filePath) {
    const content = await readFile(filePath, "utf-8")
    const validation = this.isValid(content)
    if(!validation.valid) throw new Error(validation.error)

    return this.parseCSVToJSON(content)

  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/)
    const isHeaderValid = header === options.fields.join(',')

    if(!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    if(!fileWithoutHeader.length || fileWithoutHeader.length > options.maxLines) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }

    return {valid: true}
  }

  static parseCSVToJSON(csvString) {
    const rows = csvString.split(/\r?\n/)
    const header = rows.shift()
    const headerArr = header.split(',')

    return rows.map(row => {
      const rowArr = row.split(',')

      const user = {}

      for (const index in headerArr) {
        user[headerArr[index]] = rowArr[index]
      }

      return user

    })
  }
}

module.exports = File