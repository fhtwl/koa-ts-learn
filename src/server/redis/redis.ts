import redisConfing from './redisConfing'
import IoreDis from 'IoreDis'
const redis = new IoreDis(redisConfing)
export default redis

setInterval(() => {
  redis.exists('0')
}, 15000)
