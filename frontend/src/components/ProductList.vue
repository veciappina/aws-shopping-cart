<template>
  <div v-if="cartMounted" class="product-list">
    <h1>Product List</h1>
    <ul>
      <li v-for="(product, i) in products" :key="product.id">
        {{ product.name }}, price: {{ product.price }}, quantity: <PlusMinusField :value="0" :min="0" :max="99"></PlusMinusField><button @click="addToCart(product.id, i, $event)">Add to Cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import PlusMinusField from "./PlusMinusField.vue"
import Cookies from "js-cookie"

export default {
  name: 'ProductList',
  props: ['cartMounted'],
  data() {
    return {
      products: []
    }
  },
  components: {
    PlusMinusField,
  },
  async mounted () {
    let response = await axios.get('/api/products')
    this.products = response.data
  },
  methods: {
    async addToCart (productId, i, event) {
      let quantity = event.target.parentElement.children[0].children[1].children[0].value
      if (quantity !== 0) {
        this.$children[i].newValue = 0
        await axios.put('/api/cart', {
          productId: productId,
          quantity: quantity,
          shoppingCartId: Cookies.get('shopping-cart-id'),
          addition: true
        })
        this.$emit('AddedToCart')
      }
    }
  }
}
</script>
