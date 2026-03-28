<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <div class="sf-array">
      <div v-for="(item, i) in items" :key="i" class="sf-array__row">
        <div class="sf-array__item">
          <WidgetResolver :schema="itemSchema" :value="item" :path="`${path}.${i}`" />
        </div>
        <button type="button" class="sf-array__remove" @click="removeItem(i)">✕</button>
      </div>
      <button
        v-if="!schema.maxItems || items.length < schema.maxItems"
        type="button"
        class="sf-array__add"
        @click="addItem"
      >+ Add {{ schema.title ?? 'item' }}</button>
    </div>
  </FieldWrapper>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue'
import type { JSONSchema7, JSONSchema7TypeName } from 'json-schema'
import FieldWrapper from './FieldWrapper.vue'
import WidgetResolver from '../WidgetResolver.vue'
import { FORM_CONTEXT_KEY } from '../formContext'

export default defineComponent({
  name: 'ArrayField',
  components: { FieldWrapper, WidgetResolver },
  props: {
    schema: { type: Object as () => JSONSchema7, required: true },
    value: { default: () => [] },
    path: { type: String, required: true },
    label: { type: String, default: '' },
  },
  setup(props) {
    const ctx = inject(FORM_CONTEXT_KEY)!
    const fieldLabel = computed(() => props.label || props.schema.title || props.path)
    const items = computed(() => (props.value as unknown[]) ?? [])

    const itemSchema = computed((): JSONSchema7 => {
      if (props.schema.items && typeof props.schema.items === 'object' && !Array.isArray(props.schema.items)) {
        return props.schema.items as JSONSchema7
      }
      return { type: 'string' as JSONSchema7TypeName }
    })

    function defaultValue(schema: JSONSchema7): unknown {
      if (schema.default !== undefined) return schema.default
      const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
      switch (type) {
        case 'string': return ''
        case 'number': case 'integer': return 0
        case 'boolean': return false
        case 'object': return {}
        case 'array': return []
        default: return ''
      }
    }

    function addItem() {
      ctx.onFieldChange(props.path, [...items.value, defaultValue(itemSchema.value)])
    }

    function removeItem(index: number) {
      ctx.onFieldChange(props.path, items.value.filter((_, i) => i !== index))
    }

    return { ctx, fieldLabel, items, itemSchema, addItem, removeItem }
  },
})
</script>

<style scoped>
.sf-array { display: flex; flex-direction: column; gap: 0.5rem; }
.sf-array__row { display: flex; align-items: flex-start; gap: 0.5rem; }
.sf-array__item { flex: 1; }
.sf-array__remove { flex-shrink: 0; margin-top: 0.25rem; padding: 0.25rem 0.5rem; cursor: pointer; }
</style>