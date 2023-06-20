import {env} from "./config/config.js"
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

import cluster from 'cluster'
import { cpus } from 'os'

const numSubProcesos = cpus().length
console.log(numSubProcesos)


if (cluster.isPrimary) {
    console.log("Soy el proceso principal supervisor")
    for (let i = 0; i < numSubProcesos; i++) {
        cluster.fork() //Genero 8 proceso hilo
    }

} else {
    console.log(`Hola, soy un subproceso con el id ${env.process.pid}`)
    //cluster.fork() No puedo generar un subproceso a traves de un subproceso
}