<template>
  <div class="shopping-cart">
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="(product) in products" :key="product.name">
        {{ product.name }}, quantity: {{ product.quantity }}, total: {{ getTotalForProduct(product) }}
      </li>
    </ul>
    <h4>Total: {{ total }}</h4>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  name: 'ShoppingCart',
  data () {
    return {
      products: []
    }
  },
  methods: {
    getTotalForProduct (product) {
      return Math.floor(product.quantity * product.price * 100) / 100
    }
  },
  computed: {
    total () {
      return Math.floor(this.products.map(p => this.getTotalForProduct(p)).reduce(function(a, b) { return a + b; }, 0)* 100) / 100
    }
  },
  async mounted () {
    let shoppingCartId = Cookies.get('shopping-cart-id')
    let response = await axios.post('/api/cart', {
      shoppingCartId: shoppingCartId
    })
    this.products = response.data.products
    if (!shoppingCartId || shoppingCartId !== Cookies.get('shopping-cart-id') || shoppingCartId !== response.data.id) Cookies.set('shopping-cart-id', response.data.id)
    this.$emit('CartMounted')
  }
}
</script>
