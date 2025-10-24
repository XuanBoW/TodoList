<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
// 直接使用我们刚写的 TodoView
import TodoView from './views/TodoView.vue'

const store = useTodoStore()
const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return
  }
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      console.log('z')
      e.preventDefault()
      store.undo()
    } else if (e.key === 'y' || (e.shiftKey && e.key === 'Z')) {
      console.log('y')
      e.preventDefault()
      store.redo()
    }
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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