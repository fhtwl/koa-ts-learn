export default {
  type: 'object',
  required: ['id', 'type', 'name', 'parentId', 'icon', 'serialNum', 'show'],
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    parentId: {
      type: 'number',
    },
    path: {
      type: ['string', 'null'],
    },
    icon: {
      type: ['string', 'null'],
    },
    serialNum: {
      type: 'number',
    },
    show: {
      type: 'number',
      enum: [0, 1],
    },
    component: {
      type: ['string', 'null'],
    },
    permission: {
      type: 'string',
    },
    type: {
      type: 'number',
      enum: [1, 2, 3],
    },
  },
}
