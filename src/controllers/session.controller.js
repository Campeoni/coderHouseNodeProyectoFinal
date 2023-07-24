import { findUserByEmail, updatePassword, updateUser } from '../services/userService.js'  //export instance of the user.controller class
import { createHash,validatePassword } from '../utils/bcrypt.js'
import { generateTokenRestorePass,generateToken } from '../utils/jwt.js'
import {env} from "../config/config.js"
import {cookiesTime} from "../utils/dictionary.js"
import {transporter} from "../utils/mail.js"
import {jwtReader } from '../utils/jwt.js'


export const getSession = (req,res) => {
  try {
    if (req.session.login) {
      const sessionData = {}
            
      if (req.session.userFirst) {
        sessionData.name= req.session.userFirst
        sessionData.rol= req.session.rol
      } else {
        sessionData.name= req.session.user.first_name
        sessionData.rol= req.session.user.rol      
      }
      return sessionData
    } else {
      res.redirect('/login', 500, { message: "Logueate para continuar" })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const testLogin = async (req,res) => {
  try {    
    const { email, password } = req.body

    const user = await findUserByEmail(email)

    if (user && validatePassword(password, user.password)) {
      req.session.login = true
      req.session.userFirst = user.first_name
      req.session.rol = user.rol

      const fechaHora = new Date();
      fechaHora.setHours(fechaHora.getHours() - 3);      
      const fechaHoraGMT = fechaHora.getTime();

      await updateUser(user._doc._id,{ lastConnection: fechaHoraGMT } )
      const token = generateToken(user)

      return res
        .cookie('jwtCookies',token,{maxAge: cookiesTime.jwt , httpOnly: true} ) // setea la cookie
        .status(200)
        .json({token})//muestra el token

    } else {
      res.status(401).json({
        message: "User or password incorrect"
      })
    }    
    
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const recoverPasswordEmail = async (req, res) => {
  const { email } = req.params
  try {
    const user = await findUserByEmail(email)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Email not found in database'
      })  
    }

  // * User email found
    //const resetLink = await generatePasswordResetLink(user, req, res)
    const resetLink = `http://localhost:${env.port || 5000}/recoverChangePassword`

    const mailToSend = {
      from: 'no-reply',
      to: email,
      subject: 'Password reset link',
      html: `
      <p>Muy buenas ${user.first_name},</p>
      <p>Si deseas reestablecer la contraseña haz click <a href="${resetLink}">en el siguiente link</a> para reestablecer tu contraseña:</p>
    
      <p>Si no solicitaste un cambio de contraseña, ignora este email.</p>`
    }
    transporter.sendMail(mailToSend)

    req.logger.info(`Password reset link sent to ${email}`)
    const token = generateTokenRestorePass(email)

    ; // 1 hora en milisegundos

    return res
      .status(200)
      .cookie('jwtCookiesRestorePass',token,{maxAge: cookiesTime.RestorePass  , httpOnly: true} )
      .clearCookie('booleanTimeOut')
      .json({
          status: 'success',
          message: `Password reset link sent to ${email}`,
          Link: resetLink,
          token: token

        })

  } catch (error) {
    req.logger.error(`Error in password reset procedure - ${error.message}`)
    res.status(500).send({
      status: 'error',
      message: error.message
    })
    next(error)
}}


export const changePass = async (req, res, next) => {
  const { email, password } = req.body
  const user = await findUserByEmail(email)

  if (!validatePassword(password, user.password)) {  
    const passwordHash = createHash(password) 
    await updatePassword(user.id,passwordHash) 
  } else {
    return res.status(500).send("uso la misma password")
  }

  return res.status(200)
  .clearCookie('jwtCookiesRestorePass')
  .send("Password modificada")
}

export const destroySession = (req, res) => {
  
  try{
    const jwtCookies = req.cookies.jwtCookies;

    if (!jwtCookies) {
        return res.status(401).send({
            status: "error",
            message: 'No se proporcionó ninguna token de autenticación'
        });
    }

    const token = jwtReader(jwtCookies)

    if(token) {
      res.clearCookie('jwtCookies');
      res.status(200).send({status: "success", message: 'Sesión cerrada exitosamente' });
    } else {
      return res.status(401).send({status: "error", message: 'Token no válida' });
    };    

  } catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const requireAuth = (req, res, next) => {
  //console.table(req.session)
  req.session.login ? next() : res.redirect('/login')
}