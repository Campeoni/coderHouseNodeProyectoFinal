import { findUserByEmail, updatePassword } from '../services/userService.js'  //export instance of the user.controller class
import { createHash,validatePassword } from '../utils/bcrypt.js'
import { generateTokenRestorePass,generateToken } from '../utils/jwt.js'
import {env} from "../config/config.js"
import {transporter} from "../utils/mail.js"


export const getSession = (req,res) => {
  try {
    if (req.session.login) {
      const sessionData = {}
            
      if (req.session.userFirst) {
        sessionData.name= req.session.userFirst
        sessionData.rol= req.session.rol
      } else {
        sessionData.name= req.session.user.firstname
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

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.login = true
      req.session.userFirst = "Admin Coder"
      req.session.rol = "admin"
      console.log(`${email} is ${user.rol}`)
      res.redirect('/products')
    } else {
      const user = await findUserByEmail(email)

      if (user && validatePassword(password, user.password)) {
        req.session.login = true
        req.session.userFirst = user.firstname
        req.session.rol = user.rol
        console.log(`${email} is ${user.rol}`)
        console.table(req.session)  
        const token = generateToken(user)

        return res
          .cookie('jwtCookies',token,{maxAge: 30000 , httpOnly: true} ) // setea la cookie
          .status(200)
          .json({token})//muestra el token

      } else {
        res.status(401).json({
          message: "User or password incorrect"
        })
      }    
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
      <p>Muy buenas ${user.firstname},</p>
      <p>Si deseas reestablecer la contraseña haz click <a href="${resetLink}">en el siguiente link</a> para reestablecer tu contraseña:</p>
    
      <p>Si no solicitaste un cambio de contraseña, ignora este email.</p>`
    }
    transporter.sendMail(mailToSend)

    req.logger.info(`Password reset link sent to ${email}`)
    const token = generateTokenRestorePass(email)

    const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

    return res
      .status(200)
      .cookie('jwtCookiesRestorePass',token,{maxAge: oneHour  , httpOnly: true} )
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
  try {
    if (req.session.login) {
      req.session.destroy()
      console.log(`Session closed`)
    }
    
    res.status(200).redirect('/')  
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const requireAuth = (req, res, next) => {
  //console.table(req.session)
  req.session.login ? next() : res.redirect('/login')
}