import jwt from "jsonwebtoken"
import {env} from "../config/config.js"


export const generateToken = (user) => {
  /*
    1er: Objeto de asociacion del token
    2do: Clave privada del cifrado
    3er: Tiempo de expiracion
  */
  const token = jwt.sign({user}, env.signedCookie, {expiresIn:'24h'})
  return token
}

export const generateTokenRestorePass = (data) => {
  /*
    1er: Objeto de asociacion del token
    2do: Clave privada del cifrado
    3er: Tiempo de expiracion
  */
  const token = jwt.sign({data}, env.signedCookie, {expiresIn:'1h'})
  return token
}


//ver para que sirve esto!
export const authToken = (req, res, next) => {
  //Consultar en el header el token
  const authHeader = req.headers.authoritation
  
  if(!authHeader){ //Token no existe o expirado
    return res.status(401).send({error: "Usuario no autenticado"})
  }

  //Sacar la palabra Bearer del token
  const token = authHeader.split('')[1]

  //Validar si el token es valido o no
  jwt.sign(token, env.signedCookie, (error, Credential)=>{

    if(error){ //Validar si el token fue adulterado
      return res.status(403).send({error: "usuario no autorizado"})
    }

    //Token existe y valido
    req.user = Credential.user
    
    next()
  })
}

export const jwtReader = (tokenIn) => {
  let token = null
  try {
    if (tokenIn){
      return token = jwt.verify(tokenIn, env.signedCookie)
    }
  } catch (error) {
    token = "timeOut"
  }

  return token
}