export default {
  type: 'object',
  required: ['roleId', 'ids'],
  properties: {
    roleId: {
      type: 'number',
    },
    ids: {
      type: 'string',
    },
  },
}
