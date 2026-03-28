<template>
  <div :class="['sf-field', { 'sf-field--inline': inline, 'sf-field--error': hasError }]">
    <label :for="path" class="sf-field__label">{{ label }}</label>
    <p v-if="schema.description" class="sf-field__description">{{ schema.description }}</p>
    <div class="sf-field__control">
      <slot />
    </div>
    <ul v-if="hasError" class="sf-field__errors" role="alert">
      <li v-for="(msg, i) in fieldErrors" :key="i">⚠ {{ msg }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { JSONSchema7 } from 'json-schema'
import { FORM_CONTEXT_KEY } from '../formContext'

const props = defineProps<{
  path: string
  label: string
  schema: JSONSchema7
  inline?: boolean
}>()

const ctx = inject(FORM_CONTEXT_KEY)!
const fieldErrors = computed(() => ctx.errors.value[props.path] ?? [])
const hasError = computed(() => fieldErrors.value.length > 0)
</script>

<style scoped>
.sf-field {
  margin-bottom: 1.25rem;
}
.sf-field--inline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.sf-field--inline .sf-field__label {
  margin-bottom: 0;
  min-width: 140px;
}
.sf-field--inline .sf-field__description {
  margin: 0;
  flex: 1;
}
.sf-field__label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.3rem;
  letter-spacing: 0.01em;
}
.sf-field__description {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}
.sf-field--error .sf-field__control input,
.sf-field--error .sf-field__control select {
  border-color: #f87171;
  background: #fff5f5;
}
.sf-field__errors {
  list-style: none;
  margin: 0.35rem 0 0;
  padding: 0;
  color: #ef4444;
  font-size: 0.78rem;
  font-weight: 500;
}
</style>