import config from "./config/config.js"
import express from "express";
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import { __dirname } from "./path.js";
import routers from './routes/routes.js'
import passport from "passport";
import initializePassport from "./middleware/passport.js";
import session from 'express-session';
import nodemailer from 'nodemailer' 
import errorHandler from "./middleware/errors/errorHandler.js";

import {Server} from "socket.io";
import * as path from 'path'
import { engine } from 'express-handlebars';
import {findMessages, updateMessage} from './services/messageService.js'

const app = express(); 

let transporter = nodemailer.createTransport({// genero la forma de enviar informacion
  host: 'smtp.gmail.com', //defino el servicio de mail a utilizar (gmail)
  port: 465,
  auth:{
    user:'nicolas.campeoni.dev@gmail.com',
    pass: config.mailPass,
    authMethod: 'LOGIN'
  }
})

app.get('/email', async (req,res)=>{
  await transporter.sendMail({
    from:'Test coder nicolas.cammpeoni.dev@gmail.com',
    //to: "franciscopugh01@gmail.com",
    to: "nicolas.campeoni@gmail.com",
    subject: "probando",
    html:`
    <div>
      este es un mail de prueba
    </div>
    `,
    attachments: []
  })
  res.send("email enviado")
})

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Permite realizar consultas en la URL (req.query)
app.use(cookieParser(config.cookieSecret))
app.use(errorHandler);

//session
app.use(session({  
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}))

//Passport (usa session)
app.use(passport.initialize())

initializePassport(passport)

//MONGOOSE (set and connection)
const connectionMongoose = async () => {
  await mongoose.connect(config.urlMongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .catch((err) => console.log(err));
}

connectionMongoose()

//Routers
app.use('/', routers)

//Public folder
app.use('/', express.static(__dirname + '/public'))

//if a URL is invalid display a message
app.use((req, res, next)=> {
  res.status(404).send({error:'Lo siento, no se pudo encontrar la página que estás buscando.'});
});

// Server launch
app.set ("port", config.port || 5000)

const server = app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`)
})

//HandleBars Configuration
app.engine('handlebars', engine());   //configuración del motor de express
app.set('view engine', 'handlebars'); //indica que usaremos el motor de vista handlebars
app.set('views', path.resolve(__dirname, './views')); //__dirname + './views'


//ServerIO
const io = new Server(server)

//SocketIo Server Connection
io.on("connection", async (socket)=> {  
  console.log("cliente socket conectado!");  
  
  socket.on("loadMessage", async () => {
    const textMessage = await findMessages()
    socket.emit("pushMessage", textMessage)
  })
  
  socket.on("addMessage", async (newMessage) => {
    await updateMessage([newMessage])  

    const textMessage = await findMessages()    
    socket.emit("pushMessage", textMessage)
  })

})


