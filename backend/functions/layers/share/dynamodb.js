let AWS = require('aws-sdk')
let config = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
}

function callDynamoDB (method, params) {
    return new Promise ((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient(config)
        docClient[method](params, function(err, data) {
            if (err) reject(err)
            else resolve(data.Items)
        })
    })
}

module.exports = {
    callDynamoDB
}