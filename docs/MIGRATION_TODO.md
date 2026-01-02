# Project Chiral React 迁移计划

> 基于 `references/frontend-vue/docs/MIGRATION_TO_REACT.md` 制定的迁移 TODO List

## 迁移阶段概览

| 阶段 | 名称 | 优先级 | 状态 |
|------|------|--------|------|
| Phase 1 | 基础设施迁移 | 🔴 高 | 进行中 |
| Phase 2 | 核心组件迁移 | 🔴 高 | 待开始 |
| Phase 3 | 功能模块迁移 | 🟡 中 | 待开始 |
| Phase 4 | 收尾工作 | 🟢 低 | 待开始 |

---

## Phase 1: 基础设施迁移

### 1.1 构建工具与开发环境
- [ ] 配置 Vite + React + TypeScript (已完成)
- [ ] 配置 Tailwind CSS 4.x (已完成)
- [ ] 配置 ESLint 规则
- [ ] 配置 Prettier 代码格式化
- [ ] 配置 HMR 热更新

### 1.2 状态管理
- [ ] 配置 Zustand 全局 store (已完成)
- [ ] 配置 Zustand workspace store (已完成)
- [ ] 实现组件作用域 store 模式
- [ ] 迁移 Vue createStore 模式

### 1.3 数据获取层
- [ ] 配置 TanStack Query v5 (已完成)
- [ ] 配置 query keys 规范 (已完成)
- [ ] 迁移 Vue Query hooks 到 React

### 1.4 路由系统
- [ ] 配置 React Router v6 (已完成)
- [ ] 实现嵌套路由结构 (已完成)
- [ ] 实现懒加载模式 (已完成)

### 1.5 UI 组件库
- [ ] 配置 shadcn/ui (已完成)
- [ ] 安装基础组件: Button, Input, Label, Card, Select (已完成)
- [ ] 安装 Dialog, Dropdown, Tabs, ScrollArea, Tooltip, Popover, Separator (已完成)
- [ ] 配置深色模式主题 (已完成)
- [ ] 配置 Tailwind CSS 主题变量 (已完成)

---

## Phase 2: 核心组件迁移

### 2.1 原子组件
- [ ] Button 变体支持
- [ ] Input 表单集成
- [ ] Select 异步加载
- [ ] Card 组合布局
- [ ] Dialog 弹窗动画
- [ ] Tabs 标签页切换
- [ ] ScrollArea 滚动区域
- [ ] Tooltip 提示组件

### 2.2 布局组件
- [ ] 工作区主布局
- [ ] 侧边栏组件
- [ ] 头部导航组件
- [ ] 组件切换器

### 2.3 工具函数
- [ ] cn className 合并 (已完成)
- [ ] mitt 事件总线 (已完成)
- [ ] useDraggable 拖拽 Hook (已完成)
- [ ] Unit/UnitID/UnitIDRange 时间单位系统 (已完成)
- [ ] 迁移 VueUse 工具函数

---

## Phase 3: 功能模块迁移

### 3.1 工作区框架
- [ ] Layout 布局系统
- [ ] 组件位置状态管理
- [ ] 组件拖拽排序
- [ ] 布局序列化/反序列化

### 3.2 Gantt 时序图模块
- [ ] 时序图主组件
- [ ] SideTable 侧边表格
- [ ] MainTable 主表格
- [ ] TimeBar 时间条
- [ ] Tools 工具栏
- [ ] Gantt store 迁移
- [ ] 单位系统集成

### 3.3 Graph 关系图模块
- [ ] 关系图主组件
- [ ] EventNode 事件节点
- [ ] CharaNode 角色节点
- [ ] 节点拖拽功能
- [ ] 连线创建功能
- [ ] 视图缩放功能
- [ ] Graph store 迁移

### 3.4 Editor 富文本编辑器
- [ ] TipTap 编辑器集成
- [ ] Starter Kit 基础功能
- [ ] Document 扩展
- [ ] CharacterCount 扩展
- [ ] Placeholder 扩展
- [ ] 封面图片上传
- [ ] 自动保存防抖

### 3.5 API 层迁移
- [ ] API 客户端架构 (已完成)
- [ ] 请求拦截器 (已完成)
- [ ] 响应拦截器 (已完成)
- [ ] useEventCreate mutation
- [ ] useEventUpdate mutation
- [ ] useEventRemove mutation
- [ ] useRelations query
- [ ] useRelatedNodes query
- [ ] useRelationCreate mutation
- [ ] useRelationRemove mutation

### 3.6 选择器组件
- [ ] 事件选择器
- [ ] 角色选择器
- [ ] 场景选择器
- [ ] 异步加载选项
- [ ] 搜索防抖

### 3.7 事件管理
- [ ] 事件创建弹窗
- [ ] AtomEventForm 原子事件表单
- [ ] CollectionEventForm 集合事件表单
- [ ] 表单验证

---

## Phase 4: 收尾工作

### 4.1 测试
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 迁移 Vue 测试用例

### 4.2 类型完善
- [ ] 完善 API 类型定义
- [ ] 完善组件 Props 类型
- [ ] 完善事件类型

### 4.3 构建优化
- [ ] 配置代码分割
- [ ] 配置压缩优化
- [ ] 配置 sourcemap

### 4.4 文档
- [ ] 更新 README.md
- [ ] 更新 API 文档
- [ ] 更新组件文档

---

## 迁移统计

| 类别 | 预估工作量 |
|------|-----------|
| 基础设施 | 1-2 人天 |
| 核心组件 | 2-3 人天 |
| 功能模块 | 4-6 人天 |
| 收尾工作 | 1-2 人天 |
| **总计** | **8-13 人天** |

---

## 注意事项

1. **API 兼容性**: API 层代码可完全复用，类型定义可直接复制
2. **组件库选择**: 使用 shadcn/ui，基于 Radix UI 无头组件
3. **图形库差异**: Vue Flow 迁移到 @xyflow/react 需要注意 API 差异
4. **状态持久化**: 使用 sessionStorage 存储 project-id
5. **事件总线**: mitt 在 React 中可直接使用

---

## 进度追踪

- [x] Phase 1: 基础设施 (50%)
- [ ] Phase 2: 核心组件
- [ ] Phase 3: 功能模块
- [ ] Phase 4: 收尾工作

---

_创建时间: 2026-01-03_
_基于: references/frontend-vue/docs/MIGRATION_TO_REACT.md_
