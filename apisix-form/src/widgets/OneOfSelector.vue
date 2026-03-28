<template>
  <FieldWrapper :path="path" :label="fieldLabel" :schema="schema">
    <div>
      <!-- Tab bar -->
      <div role="tablist" class="sf-oneof__tabs">
        <button
          v-for="(opt, i) in options"
          :key="i"
          type="button"
          role="tab"
          :aria-selected="i === activeIdx"
          :class="['sf-oneof__tab', { 'sf-oneof__tab--active': i === activeIdx }]"
          @click="handleSwitch(i)"
        >
          {{ opt.title ?? `Option ${i + 1}` }}
        </button>
      </div>

      <!--
        :key="activeIdx" forces a full component remount when the tab changes.
        This clears stale sub-form state and prevents cross-schema data leaking.
      -->
      <div class="sf-oneof__panel">
        <WidgetResolver
          :key="activeIdx"
          :schema="activeSchema"
          :value="value"
          :path="path"
        />
      </div>
    </div>
  </FieldWrapper>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
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
const options = computed(() => (props.schema.oneOf ?? []) as JSONSchema7[])
const activeIdx = ref(0)
const activeSchema = computed(() => options.value[activeIdx.value])

function handleSwitch(idx: number) {
  activeIdx.value = idx
  // Clear value on switch to prevent stale data from leaking into new sub-schema
  ctx.onFieldChange(props.path, undefined)
}
</script>

<style scoped>
.sf-oneof__tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.sf-oneof__tab {
  padding: 0.4rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 0.9rem;
}
.sf-oneof__tab--active {
  border-bottom-color: #1890ff;
  font-weight: 600;
  color: #1890ff;
}
.sf-oneof__panel {
  padding-top: 0.5rem;
}
</style>