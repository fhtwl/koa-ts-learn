export default {
  type: 'object',
  required: ['name', 'parentId', 'serialNum'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    parentId: {
      type: 'number',
    },
    describe: {
      type: 'string',
    },
    serialNum: {
      type: 'number',
    },
  },
}
