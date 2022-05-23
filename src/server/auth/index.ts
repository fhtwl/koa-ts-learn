import Config from '../../config/Config'
import JWT from 'jsonwebtoken'
import { Account } from '../../common/typings/account'

/**
 * 构建token
 * @param uid
 * @param scope
 * @returns
 */
export function generateToken(uid: Account.Uid, scope: Account.Scope) {
  //传入id和权限
  const secretKey = Config.SECURITY.SECRET_KEY
  const expiresIn = Config.SECURITY.EXPIRES_IN
  const token = JWT.sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn,
    }
  )
  return token
}
