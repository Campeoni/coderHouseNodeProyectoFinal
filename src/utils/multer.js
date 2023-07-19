import multer from "multer";
import { __dirname } from "../path.js"


//Este middleware se usaa para poder manejar los distintos tipos de documentos segun se informe desde la ruta 
export const tipoDoc = (tipo) => {
  return (req, res, next) => {
  req.tipoDoc = tipo
  next()
  }
}

// Multer settings
const storage = multer.diskStorage({
  // destination example: '/src/public/uploads/profile/654789123_filename.jpg'
  destination: (req, file, cb) => {
    cb(null,__dirname+`/public/${req.tipoDoc}`)
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.uid}_${file.originalname}`)
  }
})

export const uploader = multer({ storage }) 