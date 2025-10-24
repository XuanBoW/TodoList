<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

// 定义接收的 prop
const props = defineProps<{
  todo: {
    id: number
    text: string
    done: boolean
  }
}>()

const store = useTodoStore()
// 控制是否进入编辑模式
const isEditing = ref(false)
// 编辑时的临时文本
const editText = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)
// 控制是否处于拖拽悬停状态
const isDragOver = ref(false)
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

// 获取当前任务在列表中的索引
const getIndex = () => {
  return store.todos.findIndex((t) => t.id === props.todo.id)
}
// 拖拽开始
const handleDragStart = (event: DragEvent) => {
  event.dataTransfer!.setData('text/plain', String(getIndex()))
  // 添加样式
  const target = event.target as HTMLElement
  target.classList.add('dragging')
}
// 拖拽结束
const handleDragEnd = (event: DragEvent) => {
  const target = event.target as HTMLElement
  target.classList.remove('dragging')
}
// 拖拽经过
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}
// 拖拽离开
const handleDragLeave = () => {
  isDragOver.value = false
}
// 拖拽结束（放下）
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const fromIndex = Number(event.dataTransfer!.getData('text/plain'))
  const toIndex = getIndex()
  // 只有当位置变化时才移动
  if (fromIndex !== toIndex) {
    store.moveTodo(fromIndex, toIndex)
  }
}
const tagLabel = computed(() => {
  return {
    work: '工作',
    study: '学习',
    life: '生活',
  }[props.todo.tag]
})
const tagType = computed(() => {
  return {
    work: 'danger',
    study: 'warning',
    life: 'success',
  }[props.todo.tag]
})
</script>
<template>
  <li
    :class="{ done: todo.done, 'drag-over': isDragOver }"
    class="todo-item"
    draggable="true"
    @dragstart="handleDragStart($event)"
    @dragend="handleDragEnd($event)"
    @dragover="handleDragOver($event)"
    @dragleave="handleDragLeave"
    @drop="handleDrop($event)"
  >
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
      <el-tag size="small" :type="tagType" style="margin-left: 8px">
        {{ tagLabel }}
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
  transition: transform 0.2s ease;
}
.todo-item:active {
  opacity: 0.8;
  transform: scale(1.02);
  z-index: 10;
}
.todo-item.drag-over {
  border-top: 2px solid #626aef;
}
.todo-item.dragging {
  opacity: 0.5;
  transform: rotate(20deg);
}
.todo-item:hover {
  background-color: var(--border-color);
}
.todo-item.done span {
  text-decoration: line-through;
  color: #999;
}
</style>