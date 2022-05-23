import ajv from './ajv'
/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 */
export function validate(schema: object | string | boolean, data = {}) {
  const valid: boolean | PromiseLike<any> = ajv.validate(schema, data)
  if (!valid) {
    return ajv.errorsText()
  }
}
