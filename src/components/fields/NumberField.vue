<template>
  <div class="number-field">
    <input 
      type="number" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :min="field.config.min"
      :max="field.config.max"
      class="form-number"
    />
    <div class="field-description">
      限制范围: {{ field.config.min }} - {{ field.config.max }}
    </div>
    <div class="field-error" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'NumberField',
  props: {
    field: {
      type: Object,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const errorMessage = computed(() => {
      if (!props.modelValue) return ''
      
      const numValue = parseInt(props.modelValue)
      if (isNaN(numValue)) return '请输入有效数字'
      
      if (numValue < props.field.config.min || numValue > props.field.config.max) {
        return props.field.config.message
      }
      
      return ''
    })
    
    return {
      errorMessage
    }
  }
}
</script>

<style scoped>
.number-field {
  width: 100%;
}

.form-number {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  background: #fff;
}

.form-number:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.field-description {
  margin-top: 5px;
  font-size: 12px;
  color: #888;
}

.field-error {
  margin-top: 5px;
  font-size: 12px;
  color: #ff4d4f;
}
</style>