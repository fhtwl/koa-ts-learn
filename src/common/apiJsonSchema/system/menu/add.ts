export default {
  type: 'object',
  required: ['name', 'type', 'parentId', 'serialNum', 'show'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    type: {
      type: 'number',
      enum: [1, 2, 3],
    },
    parentId: {
      type: 'number',
    },
    actions: {
      type: 'string',
    },
    path: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
    serialNum: {
      type: 'number',
    },
    show: {
      type: 'number',
      enum: [0, 1],
    },
    component: {
      type: 'string',
    },
    permission: {
      type: 'string',
    },
  },
}
