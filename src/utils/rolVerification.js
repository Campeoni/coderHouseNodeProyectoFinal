export const roleVerification = (roles) => {
  return async (req, res, next) => {    
    let bandera = 0
    let userAccess = {}
    if (req.user[0]) {
      userAccess = req.user[0]
    } else{
      userAccess = req.user
    }

      if (!req.user) {
          return res.status(401).send({ error: "User no autorizado" })
      }
      
      if (!roles.includes(userAccess.rol)){
        bandera = 1              
      }

      if (bandera == 1) {
          return res.status(401).send({ error: "User no posee los permisos necesarios" })
      }
      next()
  }
} 