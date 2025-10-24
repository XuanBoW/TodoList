<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
const store = useTodoStore()
const text = ref('')
const tag = ref<'work' | 'study' | 'life'>('life') // 默认生活
const add = () => {
  if (text.value.trim()) {
    store.addTodo(text.value, tag.value)
    text.value = ''
  }
}
</script>
<template>
  <div class="add-todo">
    <el-input
      type="text"
      v-model="text"
      placeholder="输入新任务..."
      @keyup.enter="add"
      class="todo-input"
      size="large"
    />
    <!-- 标签选择 -->
    <el-select v-model="tag" class="tag-select" size="large">
      <el-option label="工作" value="work">
        <span class="tag-option">
          <el-tag type="danger" size="small">工作</el-tag>
        </span>
      </el-option>
      <el-option label="学习" value="study">
        <span class="tag-option">
          <el-tag type="warning" size="small">学习</el-tag>
        </span>
      </el-option>
      <el-option label="生活" value="life">
        <span class="tag-option">
          <el-tag type="success" size="small">生活</el-tag>
        </span>
      </el-option>
    </el-select>
    <el-button type="primary" @click="add" size="large" class="add-button"> 添加任务 </el-button>
  </div>
</template>
<style scoped>
.add-todo-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: none;
  background-color: var(--card-bg);
}

.add-todo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.todo-input {
  flex: 1;
  min-width: 200px;
}

.todo-input :deep(.el-input__wrapper) {
  background-color: var(--item-bg);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.todo-input :deep(.el-input__inner) {
  background-color: var(--item-bg);
  color: var(--text-color);
}

.tag-select {
  width: 120px;
  border-radius: 6px;
}

.tag-select :deep(.el-select__wrapper) {
  background-color: var(--item-bg);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.tag-select :deep(.el-select__selected-item) {
  color: var(--text-color);
}

.add-button {
  border-radius: 6px;
  box-shadow: var(--shadow);
}

.tag-option {
  display: flex;
  align-items: center;
}

@media (max-width: 500px) {
  .add-todo {
    flex-direction: column;
  }

  .todo-input,
  .tag-select,
  .add-button {
    width: 100%;
  }
}

/* 暗黑模式下的特殊样式 */
.dark .add-todo-card {
  border: 1px solid var(--border-color);
}

.dark .todo-input :deep(.el-input__wrapper),
.dark .tag-select :deep(.el-select__wrapper) {
  background-color: var(--item-bg);
}

.dark .todo-input :deep(.el-input__inner),
.dark .tag-select :deep(.el-select__selected-item) {
  color: var(--text-color);
}

/* 修复按钮在暗色模式下的可见性 */
.add-button {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.add-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.dark .add-button {
  background-color: #409eff;
  border-color: #409eff;
}
</style>