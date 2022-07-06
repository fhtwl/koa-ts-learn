import Ajv from 'ajv'
// import ajvKeywords from 'ajv-keywords'
import ajvConfig from './ajvConfig'
const ajv = new Ajv(ajvConfig)
require('ajv-keywords')(ajv)

export default ajv
