import bcrypt from 'bcrypt'
import {env} from '../config/config.js'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(env.salt)))
}

export const validatePassword = (password, storedPassword) => {
    return bcrypt.compareSync(password, storedPassword)
}