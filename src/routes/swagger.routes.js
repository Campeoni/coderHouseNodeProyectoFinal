/* import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import {swaggerOptions} from "../config/config.js"
import { Router } from "express";

// "/apidocs"
const routerApidocs = Router()

const specs = swaggerJSDoc(swaggerOptions)

routerApidocs.get('/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

export default routerApidocs */