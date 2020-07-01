'use strict'
const { callDynamoDB } = require('./layers/share/dynamodb')

module.exports.handler = async event => {
  let params = {
    TableName : "shopping_carts",
    KeyConditionExpression: "#i = :id",
    ExpressionAttributeNames: {
      "#i": "id",
    },
    ExpressionAttributeValues: {
      ":id": '1'
    },
    Limit: 1
  }
  let result = await callDynamoDB('query', params)
  let products = result[0].products
  let expressionAttributeValues = {}
  for (let i in products) {
    let product = products[i]
    expressionAttributeValues[`:id${product.id}`] = product.id
  }
  let productParams = {
    TableName : "products",
    FilterExpression: `#i IN (${products.map(p => `:id${p.id}`).join(',')})`,
    ExpressionAttributeNames: {
      "#i": "id",
    },
    ExpressionAttributeValues: expressionAttributeValues
  }
  let resultProducts = await callDynamoDB('scan', productParams)

  products = products.map(p => {
    let pp = resultProducts.find(pp => pp.id === p.id)
    pp.quantity = p.quantity
    return pp
  })

  return {
    statusCode: 200,
    body: JSON.stringify(products,null,2),
  }
}
