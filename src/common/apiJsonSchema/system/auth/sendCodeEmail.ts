export default {
  type: 'object',
  required: ['userName', 'email'],
  properties: {
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
