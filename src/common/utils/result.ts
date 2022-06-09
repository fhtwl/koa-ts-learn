export function getPagination<T>(records: Array<T>, total: number, pageSize: number, pageNum: number) {
  return {
    records,
    total,
    pageSize: pageSize,
    current: pageNum,
    pages: Math.ceil(total / pageSize),
  }
}
