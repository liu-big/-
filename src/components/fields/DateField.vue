<template>
  <div class="date-field">
    <input 
      type="date" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-date"
    />
    <div class="field-description" v-if="field.config.description">
      {{ field.config.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateField',
  props: {
    field: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.date-field {
  width: 100%;
}

.form-date {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  background: #fff;
}

.form-date:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.field-description {
  margin-top: 5px;
  font-size: 12px;
  color: #888;
}
</style>