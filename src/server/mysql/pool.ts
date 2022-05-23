import mysql from 'mysql'
import mysqlConfing from './mysqlConfing'

const pool = mysql.createPool(mysqlConfing)
export default pool
