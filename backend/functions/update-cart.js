'use strict'
const { getCart, updateCartProducts } = require('./layers/share/shopping-cart')

module.exports.handler = async event => {
  let body = JSON.parse(event.body)
  let shoppingCartId = body.shoppingCartId
  let productId = body.productId
  let quantity = parseInt(body.quantity)
  let addition = body.addition
  let cart = await getCart(shoppingCartId)
  let existingProduct = false
  cart.products = cart.products.map(product => {
    if (product.id === productId) {
      existingProduct = true
      product.quantity = addition ? product.quantity + quantity : quantity
    }
    if (product.quantity !== 0) return product
  }).filter(p => !!p)
  if (!existingProduct) cart.products.push({ id: productId, quantity: quantity })

  await updateCartProducts(cart)

  return {
    statusCode: 200,
    body: JSON.stringify(cart,null,2),
  }
}
