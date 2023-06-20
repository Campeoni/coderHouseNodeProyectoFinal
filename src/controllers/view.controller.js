
import { getSession } from "./session.controller.js"
import {env} from "../config/config.js"
import {jwtReader } from '../utils/jwt.js'


const PRODUCTS_URL = `http://localhost:${env.port || 5000}/api/products`
const CARTS_URL = `http://localhost:${env.port || 5000}/api/carts`

export const productView = async (req, res) => {
  let { limit , page, query, sort } = req.query;

  // Creating links to prev and next pages
  const categoryLink = query ? `&query=${query}` : ""
  const limitLink = limit ? `&limit=${limit}` : ""
  const sortLink = sort ? `&sort=${sort}` : ""
  const pageLink = page ? `&page=${page}` : ""

  const response = await fetch(`${PRODUCTS_URL}?${categoryLink}${limitLink}${sortLink}${pageLink}`)
  const data = await response.json()

  const { status, payload, totalPages, prevPage, nextPage, actualPage, hasPrevPage, hasNextPage, prevLink, nextLink } = data  
  
  const booleanStatus = status === "Success" ? true : false
  
  const sessionData = getSession(req, res)
  const userFirst = sessionData.name
  const userRol = sessionData.rol

  const booleanAdmin = userRol === "admin" ? true : false

  res.render("productsListHtml", { //Renderizar el siguiente contenido
    titulo: "Ecommerce Backend",    
    booleanStatus,
    payload: payload.map(product => {
      product.thumbnail = `img/${product.thumbnail}`
      return product
    }),
    totalPages,
    prevPage,
    nextPage,
    actualPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    userFirst,
    userRol,
    booleanAdmin
  })
}

export const cartView = async (req, res) => {
  const response = await fetch(`${CARTS_URL}/${req.params.cid}`)
  const data = await response.json()

  const {products } = data

  let auxProducts = []

  if (products?.length > 0){
    for (const item of products) {
      auxProducts.push({
        title: item.productId.title,
        description: item.productId.description,
        price: item.productId.price,
        quantity: item.quantity
      })
    }
  } 

  res.render('cartsListHtml', {
      auxProducts,
      cartID: products?.length > 0 ? req.params.cid : "No existe"
  })
}

export const registerView = (req, res) => {
  res.render('register')
}

export const loginView = (req, res) => {
  res.render('login')
}

export const recoverPassword = (req, res) => {
  const booleanTimeOut = req.cookies.booleanTimeOut;
  res.render(
    'recoverPassword',
    {booleanTimeOut}
  )
}

export const recoverChange = (req, res) => {

  const mail = validaToken(req)
  if (!(mail === "timeOut" )) {
    const data = mail.data
    res.render('changePassword',
    {data})
  } else {
    res.cookie('booleanTimeOut', true);
    res.redirect(`/recoverPassword`) 
  }
}

export const recoverChangePassword = (req, res) => {

  const token = validaToken(req)

  if (token){    
    res.redirect(`/recoverChange`)    
  } else {
      res.cookie('booleanTimeOut', true);
      res.redirect(`/recoverPassword`) 
  }  
}

const validaToken = (data) => {
  const cookie = data.cookies ? data.cookies.jwtCookiesRestorePass : null
  const token = jwtReader(cookie)

  return token;

}