<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <input
      :id="path"
      type="number"
      :value="value !== undefined ? String(value) : ''"
      :min="schema.minimum ?? (schema.exclusiveMinimum as number)"
      :max="schema.maximum ?? (schema.exclusiveMaximum as number)"
      :step="schema.type === 'integer' ? 1 : 'any'"
      @input="handleInput(($event.target as HTMLInputElement).value)"
    />
  </FieldWrapper>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { JSONSchema7 } from 'json-schema'
import FieldWrapper from './FieldWrapper.vue'
import { FORM_CONTEXT_KEY } from '../formContext'

const props = defineProps<{
  schema: JSONSchema7
  value: unknown
  path: string
  label?: string
}>()

const ctx = inject(FORM_CONTEXT_KEY)!
const fieldLabel = computed(() => props.label ?? props.schema.title ?? props.path)

function handleInput(raw: string) {
  const parsed = props.schema.type === 'integer'
    ? parseInt(raw, 10)
    : parseFloat(raw)
  ctx.onFieldChange(props.path, isNaN(parsed) ? undefined : parsed)
}
</script>