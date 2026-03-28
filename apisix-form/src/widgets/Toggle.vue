<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema" inline>
    <input
      :id="path"
      type="checkbox"
      :checked="(value as boolean) ?? (schema.default as boolean) ?? false"
      @change="ctx.onFieldChange(path, ($event.target as HTMLInputElement).checked)"
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
</script>