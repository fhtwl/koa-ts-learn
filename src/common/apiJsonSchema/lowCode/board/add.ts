export default {
  type: 'object',
  required: ['name', 'parentId', 'type'],
  properties: {
    name: {
      type: 'string',
    },
    parentId: {
      type: 'number',
    },
    type: {
      type: 'number',
      enum: [1, 2],
    },
  },
}
