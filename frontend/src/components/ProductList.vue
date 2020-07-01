<template>
  <div class="product-list">
    <h1>Product List</h1>
    <ul>
      <li v-for="(product) in products" :key="product.id">
        {{ product.name }} quantity: <button>-</button><input><button>+</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: 'ProductList',
  data() {
    return {
      products: []
    }
  },
  async mounted () {
    let response = await axios.get('/api/products')
    this.products = response.data
  }
}
</script>
