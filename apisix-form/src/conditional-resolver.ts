import type { JSONSchema7 } from 'json-schema'
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

export function mergeSchemas(
  base: JSONSchema7,
  extra: JSONSchema7 | undefined
): JSONSchema7 {
  if (!extra) return base
  return {
    ...base,
    ...extra,
    properties: {
      ...(base.properties ?? {}),
      ...(extra.properties ?? {}),
    },
    required: [
      ...new Set([
        ...(base.required ?? []),
        ...(extra.required ?? []),
      ]),
    ],
  }
}

export function resolveEffectiveSchema(
  schema: JSONSchema7,
  value: Record<string, unknown>
): JSONSchema7 {
  let merged: JSONSchema7 = { ...schema }

  // allOf — merge unconditionally
  if (schema.allOf) {
    for (const sub of schema.allOf) {
      merged = mergeSchemas(merged, sub as JSONSchema7)
    }
    delete merged.allOf
  }

  // dependencies
  if (schema.dependencies) {
    for (const [field, dep] of Object.entries(schema.dependencies)) {
      const fieldValue = value[field]
      const isPresent =
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ''

      if (isPresent) {
        if (Array.isArray(dep)) {
          // Property dependency — just adds required fields
          merged = mergeSchemas(merged, { required: dep })
        } else {
          // Schema dependency — merge whole sub-schema
          merged = mergeSchemas(merged, dep as JSONSchema7)
        }
      }
    }
    delete merged.dependencies
  }

  // if / then / else
  if (schema.if) {
    try {
      const validate = ajv.compile(schema.if as object)
      const passes = validate(value)
      const branch = passes ? schema.then : schema.else
      if (branch) {
        merged = mergeSchemas(merged, branch as JSONSchema7)
      }
    } catch {
      // Malformed if-schema — skip
    }
    delete merged.if
    delete merged.then
    delete merged.else
  }

  return merged
}