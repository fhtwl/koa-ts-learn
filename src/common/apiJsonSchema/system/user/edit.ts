export default {
  type: 'object',
  required: ['userName', 'email', 'info', 'roleIds', 'id'],
  properties: {
    info: {
      type: 'object',
      properties: {
        nickName: {
          type: 'string',
          maxLength: 255,
          minLength: 1,
        },
        profile: {
          type: 'string',
          maxLength: 255,
        },
        avatar: {
          type: 'string',
        },
      },
    },
    userName: {
      type: 'string',
      maxLength: 255,
      minLength: 4,
    },
    email: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$',
    },
    roleIds: {
      type: 'string',
    },
    id: {
      type: 'number',
    },
  },
}
