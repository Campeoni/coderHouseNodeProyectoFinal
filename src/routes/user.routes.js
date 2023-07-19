import { Router } from "express";
import { getUsers, uploadDocs} from "../controllers/user.controller.js";
import { passportMessage } from "../utils/passportMessage.js";
import { uploader, tipoDoc } from "../utils/multer.js";

// "/api/user"
const routerUser = Router()

routerUser.route("/")
  .get(getUsers)

routerUser
  .post("/:uid/documents",
    passportMessage('jwt'),
    tipoDoc('documents'),
    uploader.single('file'),
    uploadDocs)

export default routerUser