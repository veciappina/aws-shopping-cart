'use strict'
const { getCart, updateCartProducts } = require('./layers/share/shopping-cart')

module.exports.handler = async event => {
  let body = JSON.parse(event.body)
  let shoppingCartId = body.shoppingCartId
  let cart = await getCart(shoppingCartId)
  cart.products = []
  await updateCartProducts(cart)

  return {
    statusCode: 200,
    body: JSON.stringify(cart,null,2),
  }
}
