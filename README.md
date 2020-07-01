# aws-shopping-cart
This is a basic shopping cart demo using the Serverless Framework in order to simulate AWS cloud services.

For this demo, these technologies were used:

- Serverless Framework (Using the serverless-offline plugin)
- AWS DynamoDB (using the serverless-dynamodb-local plugin).
- AWS Lambda (serverless-offline simulation)
- AWS API Gateway (serverless-offline simulation)
- VueCLI for simple frontend development.

The basic idea is to simulate a REST API controlled by a very basic UI, capable up accomplishing the next features:

- List an ordered product list
- Display a shopping cart
- Add item(s) to cart
- Change quantity of each item on a cart
- Remove item(s) from cart
- Clear entire cart

## Installation instructions

**Steps**

1) **Install NodeJs**

2) **Install serverless NPM Global dependencies (Serverless Framework and VueCLI)**
    ```
    npm install -g serverless serverless-offline @vue/cli @vue/cli-service-global
    ```
3) Install NodeJs dependencies
    ```
    npm install
    ```
4) Make sure you have these ports available on your machine:
    - 8080 (VueCLI local server)
    - 8000 (Local DynamoDB)
    - 5000 (Serverless Offline)
5) Execute:
    ```
    npm run serve
    ```
   
## Project structure

Here we can find the structure of the most important components at the project:
```
├── backend
|   ├── seeds -> Here we can find the DynamoDB dummy data seed files
|   └── functions -> Here we find all the micro functions for our REST API
|       └── layers -> Common shared code across different lambda functions
└── frontend
|   ├── public -> index.html
|   └── src
|   |   └── components -> Where ProductList and Shopping cart components rely
|   |   └── App.vue -> Our main Vue App controller
|   └── vue.config.json -> we use this to setup our proxy towards the backend port using webpack
├── README.md
```

## API design

GET
``/products`` -> Retrieves the dummy product list.

POST
``/cart`` -> Accepts a shopping cart ID and retrieves either the existing cart or a new one.

PUT
``/cart`` -> Accepts a shopping cart ID, a product ID and quantity and updates the cart's product quantity to the specified one. Additionaly an "addition" parameter can be set to true to add quantities in case the specified product is already on the cart with a specific quantity.

DELETE
``/cart`` -> Accepts a shopping cart ID and clears the entire products at the basket.

## DynamoDB design

For the purpose of this example, I choose a NoSQL DB such as DynamoDB and tried to keep the structure as simple as possible. These were the tables designed:

- products:
```
{
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    price: PRODUCT_PRICE
}
```

- shopping_carts:
```
{
    id: SHOPPING_CART_ID,
    products: [
        {
            id: PRODUCT_ID,
            quantity: PRODUCT_QUANTITY,
        },
        {..},
        {..}
    ]
}
```