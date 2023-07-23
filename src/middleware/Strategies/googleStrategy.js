import GoogleStrategy from 'passport-google-oauth20'
import { findUserByEmail, createUser } from '../../services/userService.js';
import { createCart } from '../../services/cartService.js';
import { createHash } from '../../utils/bcrypt.js'
import { generateToken } from '../../utils/jwt.js'
import {env} from "../../config/config.js"


const githubOptions = {
  clientID: env.clientIdGoogle,
  clientSecret: env.clientSecretGoogle,
  callbackURL: `http://localhost:${env.port}/authGoogle/googleSession`,
  scope: ['profile','email'] // scope: se solicita acceso al correo electrónico del usuario autenticado en GitHub. 
}

export const strategyGoogle = new GoogleStrategy(githubOptions, async (accessToken, refreshToken, profile, cb) => {
  try {
    //console.log("profile github",profile)
    const user = await findUserByEmail(profile._json.email)
    
    if (user) { //Usuario ya existe en BDD
      const token = generateToken(user)
      console.log("TOKEN=", token)
      return cb(null, user, {token: token})
    } else {
      const passwordHash = createHash('coder123')
      const idCart = await createCart()
      const userCreated = await createUser({
        first_name: profile._json.given_name,
        last_name: profile._json.family_name,
        email: profile.emails[0].value,
        password: passwordHash, //Contraseña por default ya que no puedo accder a la contraseña de github
        idCart: idCart.id
      })
      const token = generateToken(userCreated)
      console.log("TOKEN=", token)

      return cb(null, userCreated, {token: token})
    }
  } catch (error) {
    return cb(error)
  }
})



