import passport from "passport"


export const passportMessage = (strategy) =>{ //valida con JSONWebToken
  return async(req,res,next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) { //Errores del Token (Token no valido, no posee el formato adecuado o no existe )
        return next(error)
      }

      if (!user){ // No existe usuario
        return res.status(401).send({error: info.message ? info.message : info.toString()})
      }
      
      req.user = user.user //Si todo salio bien seteo el usuario 
      return next()

    }) (req, res, next)
  }
}