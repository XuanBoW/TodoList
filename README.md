# 📝 Vue 3 Todo 应用

一个功能完整、界面美观的待办事项应用，使用 Vue 3 + TypeScript + Pinia 构建，支持深色模式、标签分类、路由筛选等特性。

![Vue 3](https://img.shields.io/badge/Vue-3.x-green?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)
![Pinia](https://img.shields.io/badge/Pinia-State%20Management-red?logo=pinia)
![Element Plus](https://img.shields.io/badge/Element%20Plus-UI%20Library-orange?logo=element-plus)

> 💡 从零开始学习 Vue 3 的最佳实践项目

---

## 🌟 功能特性

✅ **核心功能**
- 添加/删除任务
- 切换完成状态
- 编辑任务内容（双击编辑）
- 统计任务总数与完成数

✅ **高级功能**
- 🔖 标签分类：工作 / 学习 / 生活
- 🔍 路由筛选：全部 / 未完成 / 已完成
- 💾 数据持久化：自动保存到 `localStorage`
- 🌙 深色模式：支持系统偏好 + 手动切换
- 🎨 UI 美化：使用 Element Plus 组件库

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Vue 3 (`<script setup>`) |
| 类型系统 | TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| UI 组件库 | Element Plus |
| 构建工具 | Vite |
| 包管理 | npm |

---

## 🚀 快速启动

```bash
# 1. 克隆项目
git clone https://github.com/your-username/vue3-todo.git
cd vue3-todo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
http://localhost:5173

后续开发计划
￼ 短期目标（交互增强）
[1] ￼ 拖拽排序：支持任务拖动调整顺序
[1] ￼ 撤销/重做：支持 Ctrl+Z / Ctrl+Y
[ ] ￼ 快捷键支持：全局快捷键导航
[ ] ￼ 批量操作：全选、删除已完成
🛠 中期目标（工程化）
[ ] ￼ 单元测试：使用 Vitest 测试 store 和组件
[ ] ￼ PWA：支持离线使用和安装到桌面
[ ] ￼ 性能优化：虚拟滚动处理大量任务
[ ] ￼ 数据导入导出：支持 JSON/CSV
￼ 长期目标（全栈化）
[ ] 🖥 后端 API：使用 Node.js + Express 提供 REST 接口
[ ] 🗃 数据库：MongoDB 或 Prisma ORM
[ ] ￼ 用户系统：注册、登录、JWT 认证
[ ] ￼ 部署上线：前端部署到 Vercel，后端部署到 Railway
