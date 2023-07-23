import local from 'passport-local'
import { findUserByEmail, createUser } from '../../services/userService.js';
import { createCart } from '../../services/cartService.js';
import { createHash, validatePassword } from '../../utils/bcrypt.js'
import CustomError from '../../utils/erroresHandler/CustomError.js'
import {EErrors} from '../../utils/erroresHandler/enums.js'
import {generateUserErrorInfo} from '../../utils/erroresHandler/info.js'
import { generateToken } from '../../utils/jwt.js'

//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion

  //Ruta a implementar
export const strategyRegister = new LocalStrategy({
    passReqToCallback: true, 
    usernameField: 'email'
  }, async (req, username, password, done) => {
    //Validar y crear Usuario
    const { first_name, last_name, email } = req.body    
    
    try {
      if(!first_name || !last_name || !email)  {
        CustomError.createError({
          name: "User creation error",
          cause: generateUserErrorInfo({first_name, last_name, email}),
          message: "Error Trying create User",
          code: EErrors.INVALID_TYPES_ERROR
        })
      }
      const user = await findUserByEmail(username) //Username = email

      if (user) { //Usuario existe
        return done(null, false, "user already exists") //null que no hubo errores || false que no se creo el usuario
      }
      const passwordHash = createHash(password)
      const idCart = await createCart()
      
      const fechaHora = new Date();
      fechaHora.setHours(fechaHora.getHours() - 3);      
      const fechaHoraGMT = fechaHora.getTime();
      
      const userCreated = await createUser({
        first_name: first_name,
        last_name: last_name,        
        email: email,
        password: passwordHash, 
        idCart: idCart.id, 
        lastConnection: fechaHoraGMT 
      })      
      
      //console.log("nunca se esta devolviendo TOKEN, ver si queda")
      //const token = generateToken(userCreated)
      //console.log("TOKEN=", token)

      return done(null, userCreated) //Usuario creado correctamente

    } catch (error) {
      return done(error)      
    }
  }
)

export const strategyLogin =  new LocalStrategy({
    usernameField: 'email' 
  }, async (username, password, done) => {
    try {
      const user = await findUserByEmail(username)

      if (!user) { //Usuario no encontrado
/*         const internalError = new Error('Usuario invalido');
              internalError.codigo = 500;  */

        return done(null, user, "usuario no valido")
      }
      if (validatePassword(password, user.password)) { //Usuario y contraseña validos
        //console.log("nunca se esta devolviendo TOKEN, ver si queda")
        //const token = generateToken(user)
        //console.log("TOKEN=", token)
        return done(null, user)
      }
      return done(null, user) //Contraseña no valida

    } catch (error) {
      return done(error)
    }
  }
)
