export default {
  type: 'object',
  required: ['password', 'userName', 'email', 'code'],
  properties: {
    code: {
      type: 'string',
      maxLength: 6,
      minLength: 6,
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
  },
}
