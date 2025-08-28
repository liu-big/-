

# 可视化拖拽表单配置系统 (Drag Form Builder)

这是一个基于 Vue 3 和 Vite 构建的可视化拖拽表单配置系统。它允许用户通过简单的拖拽操作来动态创建和配置表单。

## ✨ 功能特性

  - **可视化拖拽**: 从字段库中拖拽所需的表单项到预览区域，直观地构建表单结构。
  - **动态排序**: 使用 `Sortable.js`，可以轻松地对已添加的表单字段进行拖拽排序。
  - **丰富的字段类型**: 内置文本框、下拉选择、日期选择和数字输入等常用字段。
  - **实时配置**: 在右侧配置面板中可以实时修改字段的标签、占位符、选项等属性。
  - **字段操作**: 支持对单个字段进行**复制**和**删除**操作。
  - **主题切换**: 提供简约、商务、活力三种主题风格，一键切换表单外观。
  - **表单操作**:
      - **预览模式**: 查看表单的最终呈现效果。
      - **清空表单**: 一键移除所有已配置的字段。
      - **导出配置**: 将当前表单结构和配置导出为 JSON 文件。
      - **保存配置**: 将配置保存到浏览器的 `localStorage` 中，方便下次使用。
  - **提交动效**: 提交表单时带有炫酷的粒子效果，提升用户体验。

## 🛠️ 技术栈

  - **前端框架**: Vue.js 3
  - **构建工具**: Vite
  - **拖拽库**: Sortable.js
  - **UI**: 自定义 CSS 样式

## 🚀 快速开始

请确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (建议版本 \>= 16.x)。

### 1\. 克隆项目

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2\. 安装依赖

使用 `npm` 或 `yarn` 安装项目所需的依赖包。

```bash
# 使用 npm
npm install

# 或者使用 yarn
yarn install
```

### 3\. 运行开发服务器

执行以下命令来启动 Vite 开发服务器。

```bash
npm run dev
```

启动成功后，您将看到类似以下的输出：

```
  VITE v4.0.0  ready in 638 ms

  ➜  Local:   http://localhost:3005/
  ➜  Network: use --host to expose
```

在浏览器中打开 `http://localhost:3005` 即可访问该系统。

## 📜 可用脚本

在 `package.json` 文件中，定义了以下常用脚本：

  - `npm run dev`: 启动开发服务器，用于本地开发和调试。
  - `npm run build`: 将项目打包构建为生产环境的静态文件。
  - `npm run serve`: 在本地预览生产环境构建后的项目。

## 📂 项目结构

```
test/
├── index.html                # HTML 入口文件
├── package.json              # 项目配置和依赖
├── vite.config.js            # Vite 配置文件
└── src/
    ├── App.vue                 # 根组件
    ├── main.js                 # Vue 应用入口
    ├── assets/                 # 静态资源 (如果需要)
    ├── components/
    │   ├── DragFormBuilder.vue # 核心的拖拽表单构建器组件
    │   └── fields/             # 各种表单字段的子组件
    │       ├── TextField.vue
    │       ├── SelectField.vue
    │       ├── DateField.vue
    │       └── NumberField.vue
    ├── styles/
    │   └── themes.css          # 主题样式文件
    └── utils/
        └── particleEffect.js   # 提交成功时的粒子效果实现
```
