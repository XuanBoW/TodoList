<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabsPaneContext } from 'element-plus'
import AddTodo from '@/components/AddTodo.vue'
import TodoItem from '@/components/TodoItem.vue'
import { useTodoStore } from '@/stores/todoStore'
import { useAppStore } from '@/stores/appStore'

const route = useRoute()
const router = useRouter()
const store = useTodoStore()
const activeTab = ref(route.name?.toString() || 'all')
const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)
const toggleTheme = appStore.toggleTheme

// 根据路由筛选任务
const filteredTodos = computed(() => {
  const filter = route.name || 'all'
  if (filter === 'active') {
    return store.todos.filter((t) => !t.done)
  }
  if (filter === 'completed') {
    return store.todos.filter((t) => t.done)
  }
  return store.todos
})
const onTabChange = (tab: TabsPaneContext) => {
  const name = tab.props.name
  router.push({ name })
}
</script>
<template>
  <div class="todo-page">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      "
    >
      <h1>📝 我的待办事项</h1>

      <!-- 💡 深色模式切换按钮 -->
      <el-button
        type="info"
        :icon="isDark ? 'icon-moon' : 'icon-sunny'"
        @click="toggleTheme"
        circle
      />
    </div>
    <el-alert
      :title="`共 ${store.totalCount} 项，已完成 ${store.doneCount}`"
      type="info"
      :closable="false"
      style="margin-bottom: 16px"
    />
    <AddTodo />
    <!-- 导航 -->
    <el-tabs v-model="activeTab" @tab-click="onTabChange" style="margin: 20px 0">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="未完成" name="active" />
      <el-tab-pane label="已完成" name="completed" />
    </el-tabs>
    <ul class="todo-list">
      <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
    </ul>
    <el-empty v-if="filteredTodos.length === 0" description="暂无任务" />
  </div>
</template>
<style scoped>
.todo-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.empty {
  color: #999;
  text-align: center;
  font-style: italic;
  margin: 20px 0;
}
</style>