'use strict'
const { createCart, getCart, getProductsData } = require('./layers/share/shopping-cart')

module.exports.handler = async event => {
  let body = JSON.parse(event.body)
  let shoppingCartId = body.shoppingCartId
  let cart
  if (!shoppingCartId) {
    cart = await createCart()
  } else {
    cart = await getCart(shoppingCartId)
    if (!cart) cart = await createCart()
    if (cart.products.length !== 0) cart.products = await getProductsData(cart)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(cart,null,2),
  }
}
