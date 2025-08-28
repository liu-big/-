<template>
  <div class="app">
    <h1>可视化拖拽表单配置系统</h1>
    <div class="container">
      <DragFormBuilder />
    </div>
  </div>
</template>

<script>
import DragFormBuilder from './components/DragFormBuilder.vue'
import './styles/themes.css'

export default {
  name: 'App',
  components: {
    DragFormBuilder
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

.app {
  padding: 20px;
}

.app h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>