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
    <el-input type="text" v-model="text" placeholder="输入新任务..." @keyup.enter="add" />
    <!-- 标签选择 -->
    <el-select v-model="tag" style="width: 120px; margin-right: 10px">
      <el-option label="工作" value="work" />
      <el-option label="学习" value="study" />
      <el-option label="生活" value="life" />
    </el-select>
    <el-button type="primary" @click="add">添加</el-button>
  </div>
</template>
<style scoped>
select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.add-todo {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

input,
button {
  padding: 8px;
}

input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>