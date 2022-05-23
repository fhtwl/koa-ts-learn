import Ajv from 'ajv'
import ajvConfig from './ajvConfig'
const ajv = new Ajv(ajvConfig)

export default ajv
