import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

function pointerToDotPath(pointer: string): string {
  return pointer.replace(/^\//, '').replace(/\//g, '.')
}

function indexByPath(errors: any[]): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const err of errors) {
    let path: string
    if (err.keyword === 'required' && err.params.missingProperty) {
      const base = pointerToDotPath(err.instancePath)
      path = base ? `${base}.${err.params.missingProperty}` : err.params.missingProperty
    } else {
      path = pointerToDotPath(err.instancePath) || '_root'
    }
    if (!result[path]) result[path] = []
    result[path].push(err.message ?? 'Invalid value')
  }
  return result
}

describe('indexByPath', () => {
  it('maps required error to the missing field name', () => {
    const validate = ajv.compile({
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' } },
    })
    validate({})
    expect(indexByPath(validate.errors!)).toHaveProperty('name')
  })

  it('maps field-level error to dot-path', () => {
    const validate = ajv.compile({
      type: 'object',
      properties: { timeout: { type: 'integer', minimum: 1 } },
    })
    validate({ timeout: 0 })
    const errs = indexByPath(validate.errors!)
    expect(errs).toHaveProperty('timeout')
    expect(errs.timeout[0]).toMatch(/minimum/i)
  })

  it('maps nested field error to dot-path', () => {
    const validate = ajv.compile({
      type: 'object',
      properties: {
        auth: {
          type: 'object',
          properties: { secret: { type: 'string', minLength: 8 } },
        },
      },
    })
    validate({ auth: { secret: 'abc' } })
    expect(indexByPath(validate.errors!)).toHaveProperty('auth.secret')
  })

  it('returns empty object when data is valid', () => {
    const validate = ajv.compile({
      type: 'object',
      properties: { x: { type: 'string' } },
    })
    const valid = validate({ x: 'hello' })
    expect(valid).toBe(true)
    expect(indexByPath([])).toEqual({})
  })
})