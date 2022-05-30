export default {
  type: 'object',
  required: ['nickName', 'profile', 'avatar', 'roleId', 'id'],
  properties: {
    nickName: {
      type: 'string',
    },
    profile: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    roleId: {
      type: 'number',
    },
    id: {
      type: 'number',
    },
  },
}
