import GitHubStrategy from 'passport-github2'
import { findUserByEmail, createUser } from '../../services/userService.js';
import { createCart } from '../../services/cartService.js';
import { createHash } from '../../utils/bcrypt.js'
import { generateToken } from '../../utils/jwt.js'
import {env} from "../../config/config.js"


const githubOptions = {
  clientID: env.clientIdGithub,
  clientSecret: env.clientSecretGithub,
  callbackURL: `http://localhost:${env.port}/authGithub/githubSession`,
  scope: ['profile','email'] // scope: se solicita acceso al correo electrónico del usuario autenticado en GitHub. 
}

export const strategyGithub = new GitHubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    //console.log("profile github",profile)
    const user = await findUserByEmail(profile._json.email)
    
    if (user) { //Usuario ya existe en BDD
      const token = generateToken(user)
      //console.log("TOKEN=", token)
      return done(null, user, {token: token})
    } else {
      const passwordHash = createHash('coder123')
      const idCart = await createCart()
      const userCreated = await createUser({
        first_name: profile._json.login,
        last_name: profile._json.html_url,
        email: profile._json.email,
        password: passwordHash, //Contraseña por default ya que no puedo accder a la contraseña de github
        idCart: idCart.id
      })
      const token = generateToken(userCreated)
      //console.log("TOKEN=", token)

      return done(null, userCreated, {token: token})
    }
  } catch (error) {
    return done(error)
  }
})



