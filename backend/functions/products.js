'use strict'
const { callDynamoDB } = require('./layers/share/dynamodb')

module.exports.handler = async event => {
  var params = { TableName : "products" }
  let products = await callDynamoDB('scan', params)
  products = products.sort((a, b) => (a.id > b.id) ? 1 : -1)
  return {
    statusCode: 200,
    body: JSON.stringify(products,null,2),
  }
}
