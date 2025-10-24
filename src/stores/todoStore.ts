import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // 保存到 localStorage 的方法
  const saveToStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  // 添加任务
  const addTodo = (text: string, tag: Todo['tag'] = 'life') => {
    todos.value.push({
      id: Date.now(), // 用时间戳做临时 ID
      text,
      done: false,
      tag
    })
    saveToStorage()
  }

  // 更新
  const updateTodoText = (id: number, newText: string) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.text = newText
    }
    saveToStorage()
  }
  // 删除任务
  const removeTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
    saveToStorage()
  }

  // 切换完成状态
  const toggleDone = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.done = !todo.done
    }
    saveToStorage()
  }
  // 👇 添加 moveTodo 方法
  const moveTodo = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    // 1. 取出要移动的项
    const movedItem = todos.value.splice(fromIndex, 1)[0]
    if (!movedItem) return
    // 2. 插入到新位置
    todos.value.splice(toIndex, 0, movedItem)

    // 3. 持久化
    saveToStorage()
  }
  // 计算属性：已完成数量
  const doneCount = computed(() => todos.value.filter(todo => todo.done).length)

  // 计算属性：总数量
  const totalCount = computed(() => todos.value.length)

  // 暴露出去，供组件使用
  return { todos, addTodo, removeTodo, toggleDone, updateTodoText, moveTodo, doneCount, totalCount }

})