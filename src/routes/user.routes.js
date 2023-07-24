import { Router } from "express";
import { getUsers, uploadDocs, deleteInactiveUsers} from "../controllers/user.controller.js";
import { passportMessage } from "../utils/passportMessage.js";
import { uploader, tipoDoc } from "../utils/multer.js";

// "/api/users"
const routerUser = Router()

routerUser.route("/")
  .get(getUsers)
  .delete(deleteInactiveUsers)

routerUser
  .post("/:uid/documents",
    passportMessage('jwt'),
    tipoDoc('documents'),
    uploader.single('file'),
    uploadDocs)

export default routerUser