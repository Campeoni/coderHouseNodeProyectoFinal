import { Router } from "express";
import { createUser } from '../controllers/user.controller.js'
import passport from "passport";


const routerUser = Router()

// ver si se puede meter el middleware con route
routerUser.route("/register")
  .post(passport.authenticate('register'), createUser)

//routerUser.post("/register", passport.authenticate('register') ,createUser )


export default routerUser