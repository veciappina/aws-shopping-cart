let AWS = require('aws-sdk')

function callDynamoDB (method, params) {
    return new Promise ((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
        docClient[method](params, function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data.Items)
            }
        })
    })
}

module.exports = {
    callDynamoDB
}