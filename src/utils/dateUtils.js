// Hàm format ngày YYYY-MM-DD sang DD/MM/YYYY
export function formatDateVN(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

// Chuyển đổi ngày YYYY-MM-DD sang thứ trong tuần (chuẩn tiếng Việt theo mockData)
export function getDayOfWeekName(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) return ''
  const date = new Date(parts[0], parts[1] - 1, parts[2])
  const dayIndex = date.getDay()
  const map = {
    0: 'Chủ nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
  }
  return map[dayIndex] || ''
}
