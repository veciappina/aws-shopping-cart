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
import axios from "axios"

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
    let response = await axios.get('/api/shopping-cart')
    this.products = response.data
  }
}
</script>
