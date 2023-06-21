import jwt from 'passport-jwt'
import {env} from "../../config/config.js"


const JWTStrategy = jwt.Strategy //Estrategia ded JWT
const ExtractJWT = jwt.ExtractJwt //Extractor ya sea de headers o cookies, ect

const cookieExtractor = (req) => {
  //Si existe cookies, verifico si existe mi cookie. Sino se cumple ninguna de las 2 asigno null
  const token = req.cookies ? req.cookies.jwtCookies : null
                              // si no existe la cookie especifica, asigno undefined a token
  return token
}

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //De donde extraigo mi token
  secretOrKey: env.signedCookie  //Mismo valor que la firma de las cookies
}

export const strategyJWT = new JWTStrategy(jwtOptions, async(jwt_payload, done) =>{
  try {
    return done(null, jwt_payload)
  } catch (error) {
    return done(error)
  }      
})
