import { findUsers, findUserById, updateUser } from '../services/userService.js';

export const getUsers = async (req, res) => {
  try {
      const users = await findUsers()
      res.status(200).json({users})

  } catch (error) {
      res.status(500).send({
        message: "Hubo un error en el servidor", 
        error: error.message
      })
  }
}

export const postUser = async (req, res) => {
  res.send({status: "success", message: "User Created"})
}

export const uploadDocs = async (req, res, next) => {
  try {
      const files = req.file
      const userID = req.params.uid

      if (!files) {
      req.logger.info('No file uploaded')
      return res.status(400).send('No file attached')
      }

      const isFound = await findUserById(userID)
      if (!isFound) {
      req.logger.info('User not found')
      return res.status(400).send('User not found')
      }

      const newDocsItem = {
      name: files.filename,
      reference: files.path
      }

      const isInfoUpdated = await updateUser(userID,{ $push: { documents: newDocsItem } } )

      req.logger.debug(isInfoUpdated)

      req.logger.info(`
      <UPLOAD>
      user email: ${req.user.user.email} 
      user id:    ${userID}
      file name:  ${files.originalname}
      file type:  ${files.mimetype}
      file size:  ${files.size}
      file path:  ${files.path}
      -------------------------EOF------------------------`)

      res.status(201).send(`File '${files.originalname}' uploaded succesfully by '${req.user.user.email}'`)

  } catch (error) {
      res.status(500).send(error)
  }
}
