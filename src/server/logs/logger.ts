import log4js from 'log4js'
import fs from 'fs'
import { isDirectory } from '../../common/utils/utils'
import logsConfing from './logsConfing'

//检查某个目录是否存在

if (!isDirectory('logs')) {
  fs.mkdirSync('logs')
}

log4js.configure(logsConfing)

const logger = log4js.getLogger('cheese')

export default logger
