export default {
  type: 'object',
  required: ['password', 'userName', 'email', 'info', 'roleIds'],
  properties: {
    info: {
      type: 'object',
      properties: {
        nickName: {
          type: 'string',
          maxLength: 255,
          minLength: 4,
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
    password: {
      type: 'string',
      maxLength: 255,
      minLength: 6,
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
  },
}
