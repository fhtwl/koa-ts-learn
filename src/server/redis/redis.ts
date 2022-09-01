import redisConfing from './redisConfing'
import IoreDis from 'ioredis'
import Config from '../../config/Config'
const redis = new IoreDis(redisConfing)
export default redis

!Config.IS_DEV &&
  setInterval(() => {
    redis.exists('0')
  }, 15000)
