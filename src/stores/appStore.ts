import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
export const useAppStore = defineStore('app', () => {
  // 从 localStorage 读取用户偏好
  const savedTheme = localStorage.getItem('theme')
  const isDark = ref<boolean>(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches))
  //  切换主题的方法
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }
  // 根据 isDark 设置 document.body 的 class
  const applyTheme = () => {
    if (isDark.value) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  // 4. 初始化时应用一次
  applyTheme()
  // 监听系统主题变化
  watch(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    (matches) => {
      if (!localStorage.getItem('theme')) {
        // 只有当用户没手动设置时，才跟随系统
        isDark.value = matches
        applyTheme()
      }
    }
  )
  return {
    isDark,
    toggleTheme
  }
})