export default {
  type: 'object',
  required: ['name', 'id', 'parentId'],
  properties: {
    name: {
      type: 'string',
    },
    id: {
      type: 'number',
    },
    parentId: {
      type: 'number',
    },
  },
}
