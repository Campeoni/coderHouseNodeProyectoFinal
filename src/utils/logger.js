import winston from "winston"
import {env} from "../config/config.js"

const customLevelOpt = {
  levels: {
    fatal:    0,
    error:    1,
    warning:  2,
    info:     3,
    http:     4,
    debug:    5
  },
  colors: {
    fatal:    'red',
    error:    'magenta',
    warning:  'yellow',
    info:     'black',
    http:     'green',
    debug:    'blue'
  }
}

//Filtros varios
//Filtro solo para warning
const warningFilter = winston.format((info, opts) => {
  return info.level === 'warning' ? info : false;
});

//Filtros para capturar debug, http e info
const debugHttpInfoFilter = winston.format((info, opts) => {
  if (info.level === 'debug' || info.level === 'http' || info.level === 'info') {
    return info  
  } else {
    return false;    
  }  
});

//Filtros para capturar desarrollo
const devFilter = winston.format((info, opts) => {
  if (env.environment === 'desarrollo') {
    return info  
  } else {
    return false;    
  }  
});

//Filtros para capturar produccion
const prdFilter = winston.format((info, opts) => {
  if (env.environment === 'produccion') {
    return info  
  } else {
    return false;    
  }  
});

//A partir de winstone.createLogger creamos nuestro logger con los transportes que necesitamos, en este caso, definimos
const logger = winston.createLogger({   
  levels: customLevelOpt.levels, //Defino que los levels del logger sean los definidos 
  transports: [    
    // Solamente incluimos este console si estamos en el ambiente de desarrollo
    new winston.transports.Console({ 
      level: 'debug',      
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOpt.colors}),
        winston.format.simple(),
        devFilter()
      )
    }),    
    // Solamente incluimos este console si estamos en el ambiente de producción
    new winston.transports.Console({ 
      level: 'info',      
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOpt.colors}),
        winston.format.simple(),
        prdFilter()
      )
    }),
    // Solamente incluimos este file si estamos en el ambiente de producción
    new winston.transports.File({
      level: 'error',
      filename: './logs/errors.log',
      format: winston.format.combine(
        winston.format.simple(),
        prdFilter()
      )
    }),
    // Este File solamente guarda loggers de warning
    new winston.transports.File({ 
      level: 'warning',
      filename: './logs/warning.log',
      format: winston.format.combine(
        winston.format.simple(),
        warningFilter()
      )      
    }),    
    // Este File solamente guarda loggers de Debug, Http e Info
    new winston.transports.File({ 
      level: 'info',
      filename: './logs/info.log',
      format: winston.format.combine(
        winston.format.simple(),
        debugHttpInfoFilter()
      )      
    })     
  ]
})

//Ahora , a partir de un middleware, vamos a colocar en el objeto req el logger, aprovecharemos ademas para hacer nuestro primer log.
//un  transporte de consola para funcionar solo a partir del nivel http
export const addLogger = (req,res, next) =>{
  req.logger = logger //Poder uitilizar el logger definido previamemtre
  req.logger.http(`${req.method} en  ${req.url} - ${new Date().toLocaleTimeString()}`)
  
  next()
}


