import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cloneDeep from 'lodash/cloneDeep'

// 定义任务的类型
interface Todo {
  id: number
  text: string
  done: boolean,
  tag: 'work' | 'study' | 'life'  // 新增标签
}

// 创建 store
export const useTodoStore = defineStore('todo', () => {

  // 读取数据，如果没有就用空数组
  const savedTodos = localStorage.getItem('todos')
  // 状态：任务列表
  const todos = ref<Todo[]>(savedTodos ? JSON.parse(savedTodos) : [])
  // 撤销/重做栈
  const undoStack = ref<Todo[][]>([])
  const redoStack = ref<Todo[][]>([])
  // 判断是否可撤销/重做
  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)
  // 保存当前状态到 undo 栈
  const saveState = () => {
    undoStack.value.push(cloneDeep(todos.value))
    // 限制撤销栈大小，防止占用过多内存
    if (undoStack.value.length > 50) {
      undoStack.value.shift()
    }
    redoStack.value = []
  }
  // 撤销操作
  const undo = () => {
    if (canUndo.value) {
      // 保存当前状态到重做栈
      redoStack.value.push(cloneDeep(todos.value))
      // 从撤销栈恢复状态
      todos.value = undoStack.value.pop()!
      saveToStorage()
    }
  }
  // 重做操作
  const redo = () => {
    if (canRedo.value) {
      // 保存当前状态到撤销栈
      undoStack.value.push(cloneDeep(todos.value))
      // 从重做栈恢复状态
      todos.value = redoStack.value.pop()!
      saveToStorage()
    }
  }
  // 包装 action，自动保存状态
  const withUndo = (action: () => void) => {
    saveState()
    action()
  }
  // 保存到 localStorage 的方法
  const saveToStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  // 添加任务
  const addTodo = (text: string, tag: Todo['tag'] = 'life') => {
    withUndo(() => {
      todos.value.push({
        id: Date.now(), // 用时间戳做临时 ID
        text,
        done: false,
        tag
      })
    })
    saveToStorage()
  }

  // 更新
  const updateTodoText = (id: number, newText: string) => {
    withUndo(() => {
      const todo = todos.value.find(todo => todo.id === id)
      if (todo) {
        todo.text = newText
      }
    })
    saveToStorage()
  }
  // 删除任务
  const removeTodo = (id: number) => {
    withUndo(() => {
      todos.value = todos.value.filter(todo => todo.id !== id)
    })
    saveToStorage()
  }

  // 切换完成状态
  const toggleDone = (id: number) => {
    withUndo(() => {
      const todo = todos.value.find(todo => todo.id === id)
      if (todo) {
        todo.done = !todo.done
      }
    })
    saveToStorage()
  }
  // 添加 moveTodo 方法
  const moveTodo = (fromIndex: number, toIndex: number) => {
    withUndo(() => {
      if (fromIndex === toIndex) return
      // 1. 取出要移动的项
      const movedItem = todos.value.splice(fromIndex, 1)[0]
      if (!movedItem) return
      // 2. 插入到新位置
      todos.value.splice(toIndex, 0, movedItem)
    })
    // 3. 持久化
    saveToStorage()
  }
  // 计算属性：已完成数量
  const doneCount = computed(() => todos.value.filter(todo => todo.done).length)

  // 计算属性：总数量
  const totalCount = computed(() => todos.value.length)

  // 暴露出去，供组件使用
  return {
    todos,
    canUndo,
    canRedo,
    doneCount,
    totalCount,
    undo,
    redo,
    addTodo,
    removeTodo,
    toggleDone,
    updateTodoText,
    moveTodo,
    withUndo
  }
})