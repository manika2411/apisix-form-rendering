<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <div role="radiogroup" class="sf-radio-group">
      <label v-for="opt in options" :key="opt" class="sf-radio-option">
        <input
          type="radio"
          :name="path"
          :value="opt"
          :checked="value === opt"
          @change="ctx.onFieldChange(path, opt)"
        />
        {{ opt }}
      </label>
    </div>
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

<style scoped>
.sf-radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.sf-radio-option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
</style>