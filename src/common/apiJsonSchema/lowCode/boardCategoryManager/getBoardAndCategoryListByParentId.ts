export default {
  type: 'object',
  required: ['pageNum', 'pageSize', 'params'],
  properties: {
    pageNum: {
      type: 'integer',
      minimum: 1,
    },
    pageSize: {
      type: 'integer',
      minimum: 1,
    },
    params: {
      type: 'object',
      required: ['parentId'],
      properties: {
        parentId: {
          type: 'integer',
        },
      },
    },
  },
}
