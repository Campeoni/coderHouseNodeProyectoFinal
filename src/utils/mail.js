import nodemailer from 'nodemailer' 
import {env} from "../config/config.js"

// Define las constantes necesarias para el servidor de correo
export const transporter = nodemailer.createTransport({// genero la forma de enviar informacion
  host: 'smtp.gmail.com', //defino el servicio de mail a utilizar (gmail)
  port: 465,
  auth:{
    user:'nicolas.campeoni.dev@gmail.com',
    pass: env.mailPass,
    authMethod: 'LOGIN'
  }
})