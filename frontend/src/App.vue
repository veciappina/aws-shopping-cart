<template>
  <div id="app">
    <ProductList @AddedToCart="remountShoppingCart" :cartMounted="cartMounted"></ProductList>
    <br>
    <br>
    <ShoppingCart :key="componentKey" @CartMounted="cartMounted=1" @RemountCart="remountShoppingCart"></ShoppingCart>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'

export default {
  name: 'App',
  data () {
    return {
      componentKey: 0,
      cartMounted: 0,
    }
  },
  methods: {
    remountShoppingCart () {
      this.componentKey = !this.componentKey
    }
  },
  components: {
    ProductList,
    ShoppingCart
  }
}
</script>

