import { findUsers, findUserById, updateUser, deleteManyUsers } from '../services/userService.js';
import {transporter} from "../utils/mail.js"

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
  res.status(200).send({message: "User Created"})
}

export const deleteInactiveUsers = async (req, res) => { // Delete Product
  
  try {      
    const users = await findUsers();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Filter users who have been inactive for more than 2 days
    const oldUsers = users.filter(user => user.lastConnection <  twoDaysAgo);

    const filter = {lastConnection:{$lt: twoDaysAgo }}
    
    const response  = await deleteManyUsers(filter);        

    if (response) {
      
      oldUsers.forEach(user=>{
        const mailToSend = {
          from: 'no-reply',
          to: user.email,
          subject: 'Hasta la vista baby!',
          html: `
          <p>Muy buenas ${user.first_name},</p>
          <p>Le comunicamos que su usuario ha sido dado de baja por pasar mas de 2 dias sin actividad</p>
        
          <p>Desde ya muchas gracias!</p>
          `
        }
        transporter.sendMail(mailToSend)
      })

      res.status(200).json({
        delete: true}) 
    } else {
      res.status(200).json({
        delete: false,
        message: "No se ha eliminado ningun usuario"}) 
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    }) 
  }
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
      user email: ${req.user.email} 
      user id:    ${userID}
      file name:  ${files.originalname}
      file type:  ${files.mimetype}
      file size:  ${files.size}
      file path:  ${files.path}
      -------------------------EOF------------------------`)

      res.status(201).send(`File '${files.originalname}' uploaded succesfully by '${req.user.email}'`)

  } catch (error) {
      res.status(500).send(error)
  }
}
