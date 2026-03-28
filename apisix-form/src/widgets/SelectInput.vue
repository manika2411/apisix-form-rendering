<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <select
      :id="path"
      :value="(value as string) ?? (schema.default as string) ?? ''"
      @change="ctx.onFieldChange(path, ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="!value" value="">— select —</option>
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
    </select>
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
const options = computed(() => (props.schema.enum ?? []) as string[])
</script>