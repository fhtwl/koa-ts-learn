export default {
  type: 'object',
  required: ['password', 'userName', 'code'],
  properties: {
    code: {
      type: ['number', 'string'],
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
  },
}
