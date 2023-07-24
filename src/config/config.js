import dotenv from 'dotenv'
import { Command } from 'commander'
import { environment as dicEnvironment} from '../utils/dictionary.js'
import { __dirname } from "../path.js";

const program = new Command()

program
  .option('--mode <mode>', "ingrese el modo de trabajo", 'dev')

program.parse()

const environment  = program.opts().mode

console.log("ingreso el comando de ambiente: ", environment);

dotenv.config({
  path: environment === dicEnvironment.development ? "./.env.dev" : "./.env.prod"
})
console.log("Estas usando el ambiente : ", process.env.AMBIENTE);

export const env = {
  environment: process.env.AMBIENTE,
  port: process.env.PORT,
  urlMongoDb: process.env.URLMONGODB,
  dbSelection: process.env.DBSELECTION,  
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  signedCookie: process.env.SIGNED_COOKIE,
  salt: process.env.SALT,
  clientIdGithub: process.env.CLIENT_ID_GITHUB,
  clientSecretGithub: process.env.CLIENT_SECRET_GITHUB,
  clientIdGoogle: process.env.CLIENT_ID_GOOGLE,
  clientSecretGoogle: process.env.CLIENT_SECRET_GOOGLE,
  mailPass: process.env.MAIL_PASS
}


export const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: "Documentacion Carrito CoderHouse",
          description: "carrito online para practica de Coderhouse"
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`] //donde esta mis documentos 
}