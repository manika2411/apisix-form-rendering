<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <div class="sf-array">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="sf-array__row"
      >
        <div class="sf-array__item">
          <WidgetResolver
            :schema="itemSchema"
            :value="item"
            :path="`${path}.${i}`"
          />
        </div>
        <button
          type="button"
          class="sf-array__remove"
          :aria-label="`Remove item ${i + 1}`"
          @click="removeItem(i)"
        >✕</button>
      </div>

      <button
        v-if="!schema.maxItems || items.length < schema.maxItems"
        type="button"
        class="sf-array__add"
        @click="addItem"
      >
        + Add {{ schema.title ?? 'item' }}
      </button>
    </div>
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

const ctx = inject(FORM_CONTEXT_KEY)!
const fieldLabel = computed(() => props.label ?? props.schema.title ?? props.path)
const items = computed(() => (props.value as unknown[]) ?? [])
const itemSchema = computed(() => (props.schema.items as JSONSchema7) ?? { type: 'string' })

function addItem() {
  ctx.onFieldChange(props.path, [...items.value, defaultValue(itemSchema.value)])
}

function removeItem(index: number) {
  ctx.onFieldChange(props.path, items.value.filter((_, i) => i !== index))
}

function defaultValue(schema: JSONSchema7): unknown {
  if (schema.default !== undefined) return schema.default
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
  switch (type) {
    case 'string': return ''
    case 'number':
    case 'integer': return 0
    case 'boolean': return false
    case 'object': return {}
    case 'array': return []
    default: return ''
  }
}
</script>

<style scoped>
.sf-array { display: flex; flex-direction: column; gap: 0.5rem; }
.sf-array__row { display: flex; align-items: flex-start; gap: 0.5rem; }
.sf-array__item { flex: 1; }
.sf-array__remove {
  flex-shrink: 0;
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.sf-array__add { align-self: flex-start; }
</style>