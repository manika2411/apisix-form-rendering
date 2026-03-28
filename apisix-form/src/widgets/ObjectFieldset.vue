<template>
  <!-- Top-level object: render fields flat, no wrapping fieldset -->
  <template v-if="!path">
    <WidgetResolver
      v-for="(subSchema, key) in properties"
      :key="key"
      :schema="(subSchema as JSONSchema7)"
      :value="(value as Record<string, unknown>)?.[key]"
      :path="String(key)"
      :label="`${(subSchema as JSONSchema7).title ?? key}${requiredSet.has(String(key)) ? ' *' : ''}`"
    />
  </template>

  <!-- Nested object: wrap in a fieldset -->
  <FieldWrapper v-else :path="path" :label="fieldLabel" :schema="schema">
    <fieldset class="sf-fieldset">
      <legend>{{ fieldLabel }}</legend>
      <WidgetResolver
        v-for="(subSchema, key) in properties"
        :key="key"
        :schema="(subSchema as JSONSchema7)"
        :value="(value as Record<string, unknown>)?.[key]"
        :path="`${path}.${key}`"
        :label="`${(subSchema as JSONSchema7).title ?? key}${requiredSet.has(String(key)) ? ' *' : ''}`"
      />
    </fieldset>
  </FieldWrapper>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { JSONSchema7 } from 'json-schema'
import FieldWrapper from './FieldWrapper.vue'
import WidgetResolver from '../WidgetResolver.vue'
import { FORM_CONTEXT_KEY } from '../formContext'

const props = defineProps<{
  schema: JSONSchema7
  value: unknown
  path: string
  label?: string
}>()

// Declare the change emit so Vue doesn't warn about non-inherited listeners
defineEmits<{
  (e: 'change', path: string, value: unknown): void
}>()

inject(FORM_CONTEXT_KEY)

const fieldLabel = computed(() => props.label ?? props.schema.title ?? props.path)
const properties = computed(() => (props.schema.properties ?? {}) as Record<string, JSONSchema7>)
const requiredSet = computed(() => new Set(props.schema.required ?? []))
</script>

<style scoped>
.sf-fieldset {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 1rem;
}
</style>