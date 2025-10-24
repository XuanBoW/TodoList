<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { Delete } from '@element-plus/icons-vue'
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
    <el-checkbox
      :model-value="todo.done"
      @change="() => store.toggleDone(todo.id)"
      size="large"
      class="todo-checkbox"
    />
    <!-- 编辑模式 -->
    <template v-if="isEditing">
      <el-input
        ref="editInputRef"
        v-model="editText"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="isEditing = false"
        size="small"
        class="edit-input"
      />
    </template>
    <div v-else class="todo-content" @dblclick="startEdit">
      <span class="todo-text">{{ todo.text }}</span>
      <el-tag size="small" :type="tagType" class="todo-tag">
        {{ tagLabel }}
      </el-tag>
    </div>
    <el-button
      size="small"
      type="danger"
      @click="store.removeTodo(todo.id)"
      class="delete-button"
      circle
    >
      <el-icon><Delete /></el-icon>
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

.edit-input :deep(.el-input__inner) {
  background-color: var(--item-bg);
  color: var(--text-color);
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
  background-color: var(--item-bg);
  transition: all 0.3s ease;
  position: relative;
}

.todo-item:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.todo-item:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.todo-item.drag-over {
  border-top: 2px solid #626aef;
  box-shadow: inset 0 2px 4px rgba(98, 106, 239, 0.2);
}

.todo-item.dragging {
  opacity: 0.6;
  transform: rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .todo-item.dragging {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.todo-checkbox {
  margin-right: 8px;
}

.todo-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.todo-text {
  flex: 1;
  word-break: break-word;
  color: var(--text-color);
}

.todo-tag {
  flex-shrink: 0;
}

.delete-button {
  margin-left: auto;
  transition: all 0.2s;
  opacity: 0.7;
}

.todo-item:hover .delete-button {
  opacity: 1;
  transform: scale(1.1);
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: #999;
}

.dark .todo-item.done .todo-text {
  color: #888;
}

/* 动画效果 */
.todo-item.fade-enter-active,
.todo-item.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.todo-item.fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-item.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>