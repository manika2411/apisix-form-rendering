<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <input
      :id="path"
      :type="inputType"
      :value="(value as string) ?? ''"
      :placeholder="(schema.default as string) ?? ''"
      :pattern="schema.pattern"
      :minlength="schema.minLength"
      :maxlength="schema.maxLength"
      @input="ctx.onFieldChange(path, ($event.target as HTMLInputElement).value)"
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
const inputType = computed(() => {
  if (props.schema.format === 'password') return 'password'
  if (props.schema.format === 'email') return 'email'
  if (props.schema.format === 'uri') return 'url'
  return 'text'
})
</script>