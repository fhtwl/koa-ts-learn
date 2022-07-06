export default {
  type: 'object',
  required: ['pageNum', 'pageSize', 'params'],
  properties: {
    pageNum: {
      type: 'number',
      min: 1,
    },
    pageSize: {
      type: 'number',
      num: 1,
    },
    params: {
      type: 'object',
    },
  },
}
