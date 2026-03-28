import type { InjectionKey, ComputedRef } from 'vue'

export interface FormContext {
  errors: ComputedRef<Record<string, string[]>>
  onFieldChange: (path: string, value: unknown) => void
}

export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('schema-form-context')