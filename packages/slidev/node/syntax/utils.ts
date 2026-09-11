export function normalizeRangeStr(rangeStr = '') {
  return !rangeStr.trim() ? [] : rangeStr.trim().split(/\|/g).map(i => i.trim())
}
