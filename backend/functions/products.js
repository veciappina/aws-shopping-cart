'use strict'
const { callDynamoDB } = require('./layers/share/dynamodb')

module.exports.handler = async event => {
  var params = { TableName : "products" }
  let result = await callDynamoDB('scan', params)

  return {
    statusCode: 200,
    body: JSON.stringify(result,null,2),
  }
}
