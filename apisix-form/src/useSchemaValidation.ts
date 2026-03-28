import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import Ajv from 'ajv'
import type { ErrorObject } from 'ajv'
import type { JSONSchema7 } from 'json-schema'

const ajv = new Ajv({ allErrors: true })

function pointerToDotPath(pointer: string): string {
  return pointer.replace(/^\//, '').replace(/\//g, '.')
}

function indexByPath(errors: ErrorObject[]): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  for (const err of errors) {
    let path: string

    if (err.keyword === 'required' && err.params.missingProperty) {
      const base = pointerToDotPath(err.instancePath)
      const field = err.params.missingProperty as string
      path = base ? `${base}.${field}` : field
    } else {
      path = pointerToDotPath(err.instancePath) || '_root'
    }

    if (!result[path]) result[path] = []
    result[path].push(err.message ?? 'Invalid value')
  }

  return result
}

export function useSchemaValidation(
  schema: ComputedRef<JSONSchema7>,
  value: ComputedRef<unknown> | Ref<unknown>
): ComputedRef<Record<string, string[]>> {
  return computed(() => {
    try {
      const validate = ajv.compile(schema.value as object)
      const valid = validate(value.value)
      if (valid || !validate.errors) return {}
      return indexByPath(validate.errors)
    } catch {
      return {}
    }
  })
}