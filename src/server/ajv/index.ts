import { Schema } from 'ajv'
import ajv from './ajv'

/**
 * json schema 校验
 * @param schema
 * @param data
 * @returns
 */
export function validate(schema: string | Schema, data = {}) {
  try {
    const valid: boolean = ajv.validate(schema, data)
    if (!valid) {
      return ajv.errorsText()
    }
  } catch (error) {
    console.log(error)
  }
}
