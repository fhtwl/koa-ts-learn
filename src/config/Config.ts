import REDIS_DB_NAME from './RedisDbName'
const isDev = process.env.NODE_ENV === 'development'

export default class Config {
  // 是否是测试环境
  public static readonly IS_DEV = isDev
  // 服务器端口
  public static readonly HTTP_PORT = 9000
  // 接口前缀
  public static readonly API_PREFIX = '/api/'
  // 根目录
  public static readonly BASE = isDev ? 'src' : 'dist/src'
  // redis数据库
  public static readonly REDIS_DB_NAME = REDIS_DB_NAME
  // mysql配置
  public static readonly MYSQL = {
    DB_NAME: 'admin',
    HOST: '127.0.0.1',
    PORT: 3306,
    USER_NAME: 'admin',
    PASSWORD: 'admin',
    CONNECTION_LIMIT: 60 * 60 * 1000,
    CONNECT_TIMEOUT: 1000 * 60 * 60 * 1000,
    ACQUIRE_TIMEOUT: 60 * 60 * 1000,
    TIMEOUT: 1000 * 60 * 60 * 1000,
  }
  // redis
  public static readonly REDIS = {
    PORT: 6379,
    HOST: '127.0.0.1',
    PASSWORD: 'admin',
    DB: 0,
  }
  // 默认时间格式
  public static readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

  // 安全配置
  public static readonly SECURITY = {
    // token key
    SECRET_KEY: 'learn-koa-ts',
    // 过期时间
    EXPIRES_IN: 60 * 60 * 24 * 0.5,
    // 存储token的redis数据库名
    TOKEN_REDIS_DB: Config.REDIS_DB_NAME.TOKEN,
  }

  // 七牛云配置
  public static readonly QINIU = {
    AK: 'xxxxxx',
    SK: 'xxxxxx',
    BUCKET: 'node-static', // 七牛云存储空间名
  }
}
