<script setup lang="ts">
// 直接使用我们刚写的 TodoView
import TodoView from './views/TodoView.vue'
</script>

<template>
  <div id="app">
    <TodoView />
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>