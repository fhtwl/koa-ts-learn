import Config from '../../config/Config'

export default {
  host: Config.MYSQL.HOST,
  port: Config.MYSQL.PORT,
  user: Config.MYSQL.USER_NAME,
  password: Config.MYSQL.PASSWORD,
  database: Config.MYSQL.DB_NAME,
  multipleStatements: true, // 运行执行多条语句
  connectionLimit: Config.MYSQL.CONNECTION_LIMIT,
  connectTimeout: Config.MYSQL.CONNECT_TIMEOUT,
  acquireTimeout: Config.MYSQL.ACQUIRE_TIMEOUT,
  timeout: Config.MYSQL.TIMEOUT,
}
