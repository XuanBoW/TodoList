<script setup lang="ts">
// 定义接收的 prop
const props = defineProps<{
  todo: {
    id: number
    text: string
    done: boolean
  }
}>()
import { useTodoStore } from '@/stores/todoStore'
import { ref, nextTick } from 'vue'
const store = useTodoStore()
// 控制是否进入编辑模式
const isEditing = ref(false)
// 编辑时的临时文本
const editText = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)
// 开始编辑
const startEdit = () => {
  editText.value = props.todo.text
  isEditing.value = true
  nextTick(() => {
    editInputRef.value?.focus()
    // editInputRef.value?.select()
  })
}
// 保存编辑
const saveEdit = () => {
  if (editText.value.trim()) {
    store.updateTodoText(props.todo.id, editText.value.trim())
  }
  isEditing.value = false
}
</script>
<template>
  <li :class="{ done: todo.done }" class="todo-item">
    <el-checkbox :model-value="todo.done" @change="() => store.toggleDone(todo.id)" />
    <!-- 编辑模式 -->
    <template v-if="isEditing">
      <el-input
        ref="editInputRef"
        v-model="editText"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="isEditing = false"
        size="small"
        style="flex: 1"
      />
    </template>
    <span v-else @dblclick="startEdit">
      {{ todo.text }}
      <el-tag
        size="small"
        :type="todo.tag === 'work' ? 'danger' : todo.tag === 'study' ? 'warning' : 'success'"
        style="margin-left: 8px"
      >
        {{ { work: '工作', study: '学习', life: '生活' }[todo.tag] }}
      </el-tag>
    </span>
    <el-button
      size="small"
      type="danger"
      @click="store.removeTodo(todo.id)"
      style="margin-left: auto"
    >
      删除
    </el-button>
  </li>
</template>
<style scoped>
.edit-input {
  flex: 1;
  padding: 4px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 1em;
}
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  gap: 10px;
  background-color: var(--item-bg);
  transition: background-color 0.3s;
}
.todo-item:hover {
  background-color: var(--border-color);
}
.todo-item.done span {
  text-decoration: line-through;
  color: #999;
}
</style>