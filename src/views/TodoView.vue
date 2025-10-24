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
const getEmptyMessage = () => {
  const filter = route.name || 'all'
  if (filter === 'active') {
    return '所有任务都已完成！'
  }
  if (filter === 'completed') {
    return '还没有完成的任务'
  }
  return '快添加一些新任务吧'
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
      <h1>我的待办事项</h1>
      <el-button
        type="info"
        :icon="!isDark ? 'icon-moon' : 'icon-sunny'"
        @click="toggleTheme"
        circle
        class="theme-toggle"
      />
    </div>
    <el-card class="stats-card">
      <div class="stats-content">
        <span class="stat-item">
          <el-text class="mx-1" type="primary">总计 {{ store.totalCount }} 项</el-text>
        </span>
        <span class="stat-item">
          <el-text class="mx-1" type="success">已完成 {{ store.doneCount }} 项</el-text>
        </span>
        <span class="stat-item">
          <el-text class="mx-1" type="info"
            >未完成 {{ store.totalCount - store.doneCount }} 项</el-text
          >
        </span>
      </div>
      <div class="action-buttons">
        <el-button size="small" :disabled="!store.canUndo" @click="store.undo"> 撤销 </el-button>
        <el-button size="small" :disabled="!store.canRedo" @click="store.redo"> 重做 </el-button>
      </div>
    </el-card>
    <AddTodo />
    <!-- 导航 -->
    <el-tabs v-model="activeTab" @tab-click="onTabChange" style="margin: 20px 0">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="未完成" name="active" />
      <el-tab-pane label="已完成" name="completed" />
    </el-tabs>

    <el-card class="todo-list-container">
      <transition-group name="todo-list" tag="ul">
        <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
      </transition-group>

      <el-empty v-if="filteredTodos.length === 0" description="暂无任务" :image-size="80">
        <template #description>
          <span>暂无任务</span>
          <p style="font-size: 14px; color: #999">{{ getEmptyMessage() }}</p>
        </template>
      </el-empty>
    </el-card>
  </div>
</template>
<style scoped>
.todo-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-toggle {
  box-shadow: var(--shadow);
}

.stats-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: none;
  background-color: var(--card-bg);
}

.stats-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 100px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.navigation-tabs {
  margin: 20px 0;
  background: var(--card-bg);
  border-radius: 8px;
  padding: 0 10px;
}

.navigation-tabs :deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

.navigation-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: var(--text-color);
}

.navigation-tabs :deep(.el-tabs__item.is-active) {
  color: #409eff;
}

.navigation-tabs :deep(.el-tabs__active-bar) {
  background-color: #409eff;
}

.todo-list-container {
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: none;
  overflow: hidden;
  background-color: var(--card-bg);
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 动画效果 */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-list-move {
  transition: transform 0.5s ease;
}

/* 暗黑模式下的特殊样式 */
.dark .stats-card,
.dark .navigation-tabs,
.dark .todo-list-container {
  border: 1px solid var(--border-color);
}

.dark .action-buttons :deep(.el-button) {
  background-color: #424242;
  border-color: #424242;
  color: var(--text-color);
}

.dark .action-buttons :deep(.el-button:hover) {
  background-color: #4d4d4d;
  border-color: #4d4d4d;
}

.dark .action-buttons :deep(.el-button.is-disabled) {
  background-color: #333;
  border-color: #333;
  color: #666;
}

.dark .el-empty :deep(.el-empty__description p) {
  color: #aaa;
}
ul {
  padding: 0;
  margin: 0;
}
</style>