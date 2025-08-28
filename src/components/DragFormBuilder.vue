<template>
  <div class="drag-form-builder">
    <div class="toolbar">
      <h3>字段库</h3>
      <div class="toolbar-content">
        <div 
          v-for="field in fieldLibrary" 
          :key="field.type"
          class="field-item"
          :data-type="field.type"
          draggable="true"
          @dragstart="handleDragStart"
        >
          <div class="field-icon">
            <i :class="field.icon"></i>
          </div>
          <div class="field-label">{{ field.label }}</div>
        </div>
      </div>
    </div>
    
    <div class="form-container">
      <div class="form-preview">
        <div class="preview-header">
          <h3>表单预览</h3>
          <div class="preview-actions">
            <button @click="clearForm" class="clear-btn">清空</button>
          </div>
        </div>
        
        <div 
          class="drop-zone"
          @dragover.prevent
          @drop="handleDrop"
          ref="dropZone"
        >
          <div 
            v-for="(field, index) in formFields" 
            :key="field.id"
            class="form-field"
            :class="{ 'dragging': draggingFieldIndex === index }"
          >
            <div class="field-header">
              <div class="field-title">
                <i :class="getFieldIcon(field.type)"></i>
                <span class="field-label">{{ field.label }}</span>
              </div>
              <div class="field-actions">
                <button @click="duplicateField(index)" class="duplicate-btn" title="复制">
                  <i class="icon-copy"></i>
                </button>
                <button @click="removeField(index)" class="remove-btn" title="删除">
                  <i class="icon-delete"></i>
                </button>
              </div>
            </div>
            
            <div class="field-config">
              <input 
                type="text" 
                v-model="field.label" 
                class="field-label-input"
                placeholder="字段标签"
              />
              
              <div class="field-type-badge">{{ getFieldTypeName(field.type) }}</div>
            </div>
            
            <component 
              :is="getFieldComponent(field.type)"
              :field="field"
              :modelValue="field.value"
              @update:modelValue="updateFieldValue(index, $event)"
            />
          </div>
          
          <div v-if="formFields.length === 0" class="empty-placeholder">
            <div class="placeholder-icon">
              <i class="icon-form"></i>
            </div>
            <p>请从左侧拖拽字段到此处</p>
            <p class="placeholder-hint">拖拽以开始构建表单</p>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="submitForm" class="submit-btn">
            <i class="icon-submit"></i>
            提交表单
          </button>
          <button @click="exportConfig" class="export-btn">
            <i class="icon-export"></i>
            导出配置
          </button>
          <button @click="previewForm" class="preview-btn">
            <i class="icon-preview"></i>
            预览模式
          </button>
        </div>
        
        <!-- 粒子效果容器 -->
        <div ref="particleContainer" class="particle-container"></div>
      </div>
      
      <div class="config-panel">
        <div class="config-header">
          <h3>配置面板</h3>
          <div class="config-actions">
            <button @click="saveConfig" class="save-btn">
              <i class="icon-save"></i>
              保存
            </button>
          </div>
        </div>
        
        <div class="theme-selector">
          <label>主题风格：</label>
          <div class="theme-options">
            <div 
              v-for="theme in themes" 
              :key="theme.value"
              class="theme-option"
              :class="{ active: currentTheme === theme.value }"
              @click="changeTheme(theme.value)"
            >
              <div class="theme-preview" :class="theme.value"></div>
              <span>{{ theme.label }}</span>
            </div>
          </div>
        </div>
        
        <div class="field-config-section" v-if="selectedField !== null">
          <h4>字段配置</h4>
          <div class="config-form">
            <div class="form-group" v-if="selectedFieldConfig.type !== 'number'">
              <label>占位符文本</label>
              <input 
                type="text" 
                v-model="selectedFieldConfig.config.placeholder"
                class="form-control"
                placeholder="请输入占位符文本"
              />
            </div>
            
            <div class="form-group" v-if="selectedFieldConfig.type === 'select'">
              <label>选项列表</label>
              <div 
                v-for="(option, idx) in selectedFieldConfig.config.options" 
                :key="idx"
                class="option-item"
              >
                <input 
                  type="text" 
                  v-model="option.label"
                  class="form-control"
                  placeholder="选项标签"
                />
                <input 
                  type="text" 
                  v-model="option.value"
                  class="form-control"
                  placeholder="选项值"
                />
                <button @click="removeOption(idx)" class="remove-option-btn">×</button>
              </div>
              <button @click="addOption" class="add-option-btn">+ 添加选项</button>
            </div>
            
            <div class="form-group" v-if="selectedFieldConfig.type === 'number'">
              <label>最小值</label>
              <input 
                type="number" 
                v-model="selectedFieldConfig.config.min"
                class="form-control"
              />
            </div>
            
            <div class="form-group" v-if="selectedFieldConfig.type === 'number'">
              <label>最大值</label>
              <input 
                type="number" 
                v-model="selectedFieldConfig.config.max"
                class="form-control"
              />
            </div>
            
            <div class="form-group" v-if="selectedFieldConfig.type === 'number'">
              <label>错误提示信息</label>
              <input 
                type="text" 
                v-model="selectedFieldConfig.config.message"
                class="form-control"
                placeholder="请输入错误提示信息"
              />
            </div>
          </div>
        </div>
        
        <div class="config-json" v-else>
          <h4>表单配置 (JSON)</h4>
          <pre>{{ JSON.stringify(formConfig, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import Sortable from 'sortablejs'
import TextField from './fields/TextField.vue'
import SelectField from './fields/SelectField.vue'
import DateField from './fields/DateField.vue'
import NumberField from './fields/NumberField.vue'
import { showSuccessEffect } from '../utils/particleEffect'

export default {
  name: 'DragFormBuilder',
  components: {
    TextField,
    SelectField,
    DateField,
    NumberField
  },
  setup() {
    // 字段库
    const fieldLibrary = [
      { type: 'text', label: '文本框', icon: 'icon-text' },
      { type: 'select', label: '下拉选择', icon: 'icon-select' },
      { type: 'date', label: '日期选择', icon: 'icon-date' },
      { type: 'number', label: '人数限制输入', icon: 'icon-number' }
    ]
    
    // 主题选项
    const themes = [
      { value: 'simple', label: '简约风' },
      { value: 'business', label: '商务风' },
      { value: 'vibrant', label: '活力风' }
    ]
    
    // 表单字段
    const formFields = ref([])
    
    // 当前选中字段
    const selectedField = ref(null)
    
    // 当前选中字段配置
    const selectedFieldConfig = ref({})
    
    // 当前拖拽字段索引
    const draggingFieldIndex = ref(-1)
    
    // 主题
    const currentTheme = ref('simple')
    
    // Drop zone引用
    const dropZone = ref(null)
    
    // 粒子效果容器
    const particleContainer = ref(null)
    
    // 预览模式
    const previewMode = ref(false)
    
    // 表单配置
    const formConfig = computed(() => {
      return {
        fields: formFields.value,
        theme: currentTheme.value
      }
    })
    
    // 初始化Sortable
    let sortable = null
    
    onMounted(() => {
      if (dropZone.value) {
        sortable = new Sortable(dropZone.value, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          dragClass: 'sortable-drag',
          onEnd: function (evt) {
            const movedItem = formFields.value.splice(evt.oldIndex, 1)[0]
            formFields.value.splice(evt.newIndex, 0, movedItem)
          }
        })
      }
      
      // 设置默认主题
      document.documentElement.setAttribute('data-theme', currentTheme.value)
    })
    
    // 监听选中字段变化
    watch(selectedField, (newVal) => {
      if (newVal !== null) {
        selectedFieldConfig.value = formFields.value[newVal]
      } else {
        selectedFieldConfig.value = {}
      }
    })
    
    // 处理拖拽开始
    const handleDragStart = (e) => {
      e.dataTransfer.setData('text/plain', e.target.dataset.type)
    }
    
    // 处理放置
    const handleDrop = (e) => {
      e.preventDefault()
      const fieldType = e.dataTransfer.getData('text/plain')
      const fieldTemplate = fieldLibrary.find(f => f.type === fieldType)
      
      if (fieldTemplate) {
        const newField = {
          id: Date.now(),
          type: fieldTemplate.type,
          label: fieldTemplate.label,
          value: '',
          config: getDefaultConfig(fieldTemplate.type)
        }
        
        formFields.value.push(newField)
      }
    }
    
    // 获取字段组件
    const getFieldComponent = (type) => {
      const components = {
        'text': 'TextField',
        'select': 'SelectField',
        'date': 'DateField',
        'number': 'NumberField'
      }
      return components[type] || 'TextField'
    }
    
    // 获取字段图标
    const getFieldIcon = (type) => {
      const icons = {
        'text': 'icon-text',
        'select': 'icon-select',
        'date': 'icon-date',
        'number': 'icon-number'
      }
      return icons[type] || 'icon-field'
    }
    
    // 获取字段类型名称
    const getFieldTypeName = (type) => {
      const names = {
        'text': '文本',
        'select': '选择',
        'date': '日期',
        'number': '数字'
      }
      return names[type] || '未知'
    }
    
    // 获取默认配置
    const getDefaultConfig = (type) => {
      const configs = {
        'text': { placeholder: '请输入文本' },
        'select': { 
          placeholder: '请选择',
          options: [
            { label: '选项1', value: 'option1' },
            { label: '选项2', value: 'option2' }
          ] 
        },
        'date': { format: 'yyyy-MM-dd' },
        'number': { min: 1, max: 100, message: '活动人数超限' }
      }
      return configs[type] || {}
    }
    
    // 更新字段值
    const updateFieldValue = (index, value) => {
      formFields.value[index].value = value
    }
    
    // 移除字段
    const removeField = (index) => {
      if (selectedField.value === index) {
        selectedField.value = null
      }
      formFields.value.splice(index, 1)
    }
    
    // 复制字段
    const duplicateField = (index) => {
      const fieldToDuplicate = { ...formFields.value[index] }
      fieldToDuplicate.id = Date.now()
      fieldToDuplicate.label = fieldToDuplicate.label + ' (副本)'
      formFields.value.splice(index + 1, 0, fieldToDuplicate)
    }
    
    // 清空表单
    const clearForm = () => {
      if (confirm('确定要清空所有字段吗？')) {
        formFields.value = []
        selectedField.value = null
      }
    }
    
    // 添加选项
    const addOption = () => {
      if (selectedFieldConfig.value.type === 'select') {
        selectedFieldConfig.value.config.options.push({
          label: '',
          value: ''
        })
      }
    }
    
    // 移除选项
    const removeOption = (index) => {
      if (selectedFieldConfig.value.type === 'select') {
        selectedFieldConfig.value.config.options.splice(index, 1)
      }
    }
    
    // 提交表单
    const submitForm = () => {
      // 验证表单
      const isValid = validateForm()
      if (isValid) {
        // 显示粒子效果
        if (particleContainer.value) {
          showSuccessEffect(particleContainer.value)
        }
        
        // 模拟提交成功
        setTimeout(() => {
          alert('提交成功!')
        }, 500)
        
        console.log('表单数据:', formFields.value)
      }
    }
    
    // 验证表单
    const validateForm = () => {
      let isValid = true
      for (let field of formFields.value) {
        if (field.type === 'number') {
          const numValue = parseInt(field.value)
          if (isNaN(numValue) || numValue < field.config.min || numValue > field.config.max) {
            alert(field.config.message)
            isValid = false
            break
          }
        }
        // 可以添加其他字段类型的验证
      }
      return isValid
    }
    
    // 导出配置
    const exportConfig = () => {
      const dataStr = JSON.stringify(formConfig.value, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = 'form-config.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
    
    // 预览模式
    const previewForm = () => {
      previewMode.value = !previewMode.value
    }
    
    // 保存配置
    const saveConfig = () => {
      localStorage.setItem('formConfig', JSON.stringify(formConfig.value))
      alert('配置已保存!')
    }
    
    // 更改主题
    const changeTheme = (theme) => {
      currentTheme.value = theme
      document.documentElement.setAttribute('data-theme', theme)
    }
    
    return {
      fieldLibrary,
      themes,
      formFields,
      selectedField,
      selectedFieldConfig,
      draggingFieldIndex,
      currentTheme,
      dropZone,
      particleContainer,
      previewMode,
      formConfig,
      handleDragStart,
      handleDrop,
      getFieldComponent,
      getFieldIcon,
      getFieldTypeName,
      updateFieldValue,
      removeField,
      duplicateField,
      clearForm,
      addOption,
      removeOption,
      submitForm,
      exportConfig,
      previewForm,
      saveConfig,
      changeTheme
    }
  }
}
</script>

<style scoped>
.drag-form-builder {
  display: flex;
  gap: 20px;
  height: calc(100vh - 100px);
}

.toolbar {
  width: 220px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.toolbar h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.toolbar-content {
  flex: 1;
}

.field-item {
  padding: 12px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border: 1px dashed #e9ecef;
  border-radius: 6px;
  cursor: move;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.field-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  border-color: #adb5bd;
}

.field-icon {
  margin-right: 10px;
  font-size: 18px;
  color: #6c757d;
}

.field-label {
  font-size: 14px;
  color: #495057;
}

.form-container {
  flex: 1;
  display: flex;
  gap: 20px;
}

.form-preview {
  flex: 2;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.preview-header h3 {
  color: #333;
  font-size: 16px;
  margin: 0;
}

.clear-btn {
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}

.drop-zone {
  flex: 1;
  min-height: 400px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow-y: auto;
}

.drop-zone .form-field {
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  background: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.drop-zone .form-field:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.drop-zone .form-field.dragging {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.field-title {
  display: flex;
  align-items: center;
}

.field-title i {
  margin-right: 8px;
  color: #6c757d;
}

.field-label {
  font-weight: bold;
  color: #495057;
}

.field-actions {
  display: flex;
  gap: 5px;
}

.duplicate-btn,
.remove-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.duplicate-btn:hover {
  background: #e9ecef;
}

.remove-btn:hover {
  background: #f8d7da;
  color: #dc3545;
}

.field-config {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.field-label-input {
  border: none;
  background: transparent;
  flex: 1;
  font-weight: bold;
  padding: 5px;
}

.field-label-input:focus {
  outline: none;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.field-type-badge {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.empty-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6c757d;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ced4da;
}

.placeholder-hint {
  font-size: 14px;
  color: #adb5bd;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.submit-btn, 
.export-btn,
.preview-btn,
.save-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.submit-btn {
  background: #1890ff;
  color: white;
  flex: 1;
}

.export-btn {
  background: #52c41a;
  color: white;
}

.preview-btn {
  background: #722ed1;
  color: white;
}

.save-btn {
  background: #fa8c16;
  color: white;
}

.config-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.config-header h3 {
  color: #333;
  font-size: 16px;
  margin: 0;
}

.config-actions {
  display: flex;
  gap: 5px;
}

.theme-selector label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #495057;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-option:hover {
  border-color: #1890ff;
  background: #f0f9ff;
}

.theme-option.active {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.theme-preview {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  margin-right: 10px;
}

.theme-preview.simple {
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border: 1px solid #d9d9d9;
}

.theme-preview.business {
  background: linear-gradient(135deg, #f5f7fa, #e6e9f0);
  border: 1px solid #bfbfbf;
}

.theme-preview.vibrant {
  background: linear-gradient(135deg, #fffbe6, #fff1b8);
  border: 1px solid #ffd700;
}

.field-config-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.option-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.option-item .form-control {
  flex: 1;
}

.remove-option-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-option-btn {
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.config-json {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 15px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.config-json h4 {
  margin-bottom: 10px;
  color: #333;
  font-size: 15px;
}

.config-json pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  flex: 1;
  max-height: 100%;
  overflow-y: auto;
  font-size: 12px;
  margin: 0;
}

/* 粒子效果容器 */
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 8px;
}

/* Sortable.js 样式 */
.sortable-ghost {
  opacity: 0.5;
  background: #e0f7fa;
}

.sortable-drag {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 图标字体 */
.icon-text::before { content: "T"; }
.icon-select::before { content: "▼"; }
.icon-date::before { content: "📅"; }
.icon-number::before { content: "123"; }
.icon-form::before { content: "📋"; }
.icon-submit::before { content: "✓"; }
.icon-export::before { content: "📤"; }
.icon-preview::before { content: "👁"; }
.icon-save::before { content: "💾"; }
.icon-copy::before { content: "📄"; }
.icon-delete::before { content: "✕"; }
</style>