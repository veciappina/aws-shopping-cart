<template>
  <div id="app">
    <ProductList></ProductList>
    <br>
    <br>
    <ShoppingCart></ShoppingCart>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'

export default {
  name: 'App',
  components: {
    ProductList,
    ShoppingCart
  }
}
</script>

