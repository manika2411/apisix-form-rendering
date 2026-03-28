<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <WidgetResolver
      :schema="effectiveSchema"
      :value="modelValue"
      path=""
      @change="handleChange"
    />
    <button v-if="showSubmit" type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { JSONSchema7 } from 'json-schema'
import WidgetResolver from './WidgetResolver.vue'
import { resolveEffectiveSchema } from './conditional-resolver'
import { useSchemaValidation } from './useSchemaValidation'
import { FORM_CONTEXT_KEY } from './formContext'

const props = defineProps<{
  schema: JSONSchema7
  modelValue: Record<string, unknown>
  showSubmit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'submit', value: Record<string, unknown>): void
}>()

const effectiveSchema = computed(() =>
  resolveEffectiveSchema(props.schema, props.modelValue)
)

const errors = useSchemaValidation(effectiveSchema, computed(() => props.modelValue))

// Provide errors + field change handler to all descendant widgets
provide(FORM_CONTEXT_KEY, {
  errors,
  onFieldChange(path: string, value: unknown) {
    const next = setNestedValue(props.modelValue, path, value)
    emit('update:modelValue', next)
  },
})

function handleChange(path: string, value: unknown) {
  const next = setNestedValue(props.modelValue, path, value)
  emit('update:modelValue', next)
}

function handleSubmit() {
  emit('submit', props.modelValue)
}

/** Immutably set a dot-path value on an object */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  if (!path) return value as Record<string, unknown>
  const keys = path.split('.')
  const next = { ...obj }
  let cursor: Record<string, unknown> = next
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...(cursor[keys[i]] as Record<string, unknown>) }
    cursor = cursor[keys[i]] as Record<string, unknown>
  }
  cursor[keys[keys.length - 1]] = value
  return next
}
</script>