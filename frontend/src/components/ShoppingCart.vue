<template>
  <div class="shopping-cart">
    <h1>Shopping Cart</h1>
    <button @click="clearCart">Clear</button>
    <ul>
      <li v-for="(product) in products" :key="product.name">
        {{ product.name }}
        , quantity: <PlusMinusField @input="value => changedInput(product.id, value)" :value="product.quantity" :min="0" :max="99"></PlusMinusField>
        total pr. item: {{ getTotalForProduct(product) }}
      </li>
    </ul>
    <h4>Total: {{ total }}</h4>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import PlusMinusField from "./PlusMinusField.vue"

export default {
  name: 'ShoppingCart',
  data () {
    return {
      products: []
    }
  },
  components: {
    PlusMinusField,
  },
  methods: {
    async changedInput (productId, quantity) {
      this.products.find(p => p.id === productId).quantity = quantity
      await axios.put('/api/cart', {
        productId: productId,
        quantity: quantity,
        shoppingCartId: Cookies.get('shopping-cart-id')
      })
      if (quantity === 0) this.$emit('RemountCart')
    },
    getTotalForProduct (product) {
      return Math.floor(product.quantity * product.price * 100) / 100
    },
    async clearCart () {
      let shoppingCartId = Cookies.get('shopping-cart-id')
      await axios.delete('/api/cart', {
        data: { shoppingCartId: shoppingCartId }
      })
      this.$emit('RemountCart')
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
