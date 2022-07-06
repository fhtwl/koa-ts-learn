export default {
  type: 'object',
  required: ['name', 'parentId'],
  properties: {
    name: {
      type: 'string',
    },
    parentId: {
      type: 'number',
    },
  },
}
