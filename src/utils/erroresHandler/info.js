export const generateUserErrorInfo = (user) => {
  return `One or more propierties were incomplete or not valid.
  List of requiered properties:
  * first_name : needs to be a String, received ${user.first_name}
  * last_name  : needs to be a String, received ${user.last_name}
  * email     : needs to be a String, received ${user.email}`
}
export const generateProductErrorInfo = (product) => {
  return `One or more propierties were incomplete or not valid.
  List of requiered properties:
  * title       : needs to be a String, received ${product.title}
  * description : needs to be a String, received ${product.description}
  * price       : needs to be a Numbre, received ${product.price}
  * code        : needs to be a String, received ${product.code}
  * stock       : needs to be a Number, received ${product.stock}
  * category    : needs to be a String, received ${product.category}`
}

export const stockCartErrorInfo = (product) => {
  return `Not enough stock:
  * quantity added ${product.cart}
  * currently there is ${product.stock}`
}

export const invalidSortErrorInfo = (sort) => {
  return `Invalid parameter in SORT: "${sort}", only allows "asc" or "desc".`
}


