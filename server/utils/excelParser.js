const ExcelJS = require('exceljs')

const parseExcelFile = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) throw new Error('No worksheet found in file')
    const data = []
    worksheet.eachRow((row, rowNumber) => { if (rowNumber === 1) return; data.push(row.values.slice(1)) })
    return data
  } catch (error) { throw new Error('Failed to parse Excel file: ' + error.message) }
}

const generateExcelBuffer = async (data, sheetName = 'Sheet1', options = {}) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)
  if (data.length > 0) {
    worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key, width: Math.max(key.length + 5, 15) }))
    data.forEach(row => worksheet.addRow(row))
    if (options.headerStyle) {
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: options.headerStyle.color || 'FF1B4F9E' } }
      })
    }
  }
  return await workbook.xlsx.writeBuffer()
}

module.exports = { parseExcelFile, generateExcelBuffer }