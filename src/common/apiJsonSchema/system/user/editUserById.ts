export default {
  type: 'object',
  required: ['nickName', 'profile', 'avatar', 'roleIds', 'id'],
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
    roleIds: {
      type: 'string',
    },
    id: {
      type: 'number',
    },
  },
}
