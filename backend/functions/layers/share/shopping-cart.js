const { callDynamoDB } = require('./dynamodb')

async function getCart (shoppingCartId) {
    let params = {
        TableName : "shopping_carts",
        KeyConditionExpression: "#i = :id",
        ExpressionAttributeNames: {
            "#i": "id",
        },
        ExpressionAttributeValues: {
            ":id": shoppingCartId
        },
        Limit: 1
    }
    let result = await callDynamoDB('query', params)
    if (result.length !== 0) {
        let cart = result[0]
        if (!cart.products) cart.products = []
        return cart
    }
}

async function createCart () {
    async function getNewShoppingCartId () {
        let shoppingCartId = Math.floor(Math.random()*1000).toString()
        let cart = await getCart(shoppingCartId)
        if (!cart) return shoppingCartId
        return getNewShoppingCartId()
    }
    let shoppingCartId = await getNewShoppingCartId()
    let params = {
        TableName: "shopping_carts",
        Item: {
            "id": shoppingCartId
        }
    }
    await callDynamoDB('put', params)
    return {
        id: shoppingCartId,
        products: []
    }
}

async function getProductsData (cart) {
    let expressionAttributeValues = {}
    for (let i in cart.products) {
        let product = cart.products[i]
        expressionAttributeValues[`:id${product.id}`] = product.id
    }
    let productParams = {
        TableName: "products",
        FilterExpression: `#i IN (${cart.products.map(p => `:id${p.id}`).join(',')})`,
        ExpressionAttributeNames: {
            "#i": "id",
        },
        ExpressionAttributeValues: expressionAttributeValues
    }
    let resultProducts = await callDynamoDB('scan', productParams)

    return cart.products.map(p => {
        let product = resultProducts.find(pp => pp.id === p.id)
        product.quantity = p.quantity
        return product
    })
}

async function updateCartProducts (cart) {
    let params = {
        TableName: "shopping_carts",
        Key: {
            "id": cart.id
        },
        UpdateExpression: "set products = :p",
        ExpressionAttributeValues: {
            ":p": cart.products
        }
    }

    return callDynamoDB('update', params)
}

module.exports = {
    getCart,
    createCart,
    getProductsData,
    updateCartProducts
}