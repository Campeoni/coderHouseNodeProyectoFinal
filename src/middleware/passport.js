import passport from 'passport'
import { strategyRegister, strategyLogin } from './Strategies/localStrategy.js'
import { strategyJWT } from './Strategies/jwtStrategy.js'
import { strategyGithub } from './Strategies/githubStrategy.js'
import { strategyGoogle } from './Strategies/googleStrategy.js'
import { findUserById } from '../services/userService.js';


const initializePassport = () => {
  passport.use('register', strategyRegister)
  passport.use('login', strategyLogin)
  passport.use('jwt', strategyJWT)
  passport.use('github', strategyGithub)
  passport.use('google', strategyGoogle)

  
  //Iniciar la session del usuario
  passport.serializeUser((user, done) => {
    done(null, user._id)
  });

  //Eliminar la sesion del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id)
    done(null, user)
  });
}

export default initializePassport