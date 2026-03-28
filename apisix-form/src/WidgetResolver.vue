<template>
  <component :is="resolvedWidget" :schema="schema" :value="value" :path="path" :label="label" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { JSONSchema7 } from 'json-schema'
import type { Component } from 'vue'
import TextInput from './widgets/TextInput.vue'
import NumberInput from './widgets/NumberInput.vue'
import Toggle from './widgets/Toggle.vue'
import SelectInput from './widgets/SelectInput.vue'
import RadioGroup from './widgets/RadioGroup.vue'
import ObjectFieldset from './widgets/ObjectFieldset.vue'
import ArrayField from './widgets/ArrayField.vue'
import OneOfSelector from './widgets/OneOfSelector.vue'

const builtinRegistry: Record<string, Component> = {
  'string':                  TextInput,
  'string+format:uri':       TextInput,
  'string+format:password':  TextInput,
  'string+enum':             SelectInput,
  'string+enum+small':       RadioGroup,
  'number':                  NumberInput,
  'integer':                 NumberInput,
  'boolean':                 Toggle,
  'object':                  ObjectFieldset,
  'array':                   ArrayField,
  'oneOf':                   OneOfSelector,
}

function resolveKey(schema: JSONSchema7): string {
  if (schema.oneOf) return 'oneOf'
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
  if (type === 'string') {
    if (schema.enum) return schema.enum.length <= 3 ? 'string+enum+small' : 'string+enum'
    if (schema.format === 'uri') return 'string+format:uri'
    if (schema.format === 'password') return 'string+format:password'
    return 'string'
  }
  return (type as string) ?? 'string'
}

export default defineComponent({
  name: 'WidgetResolver',
  props: {
    schema: { type: Object as () => JSONSchema7, required: true },
    value: { default: undefined },
    path: { type: String, required: true },
    label: { type: String, default: '' },
  },
  setup(props) {
    const resolvedWidget = computed(() => {
      const key = resolveKey(props.schema)
      return builtinRegistry[key] ?? TextInput
    })
    return { resolvedWidget }
  },
})
</script>