import { describe, it, expect } from 'vitest'
import { resolveEffectiveSchema, mergeSchemas } from '../conditional-resolver'
import type { JSONSchema7 } from 'json-schema'

const s = (schema: object) => schema as JSONSchema7

describe('mergeSchemas', () => {
  it('merges properties from both schemas', () => {
    const a = s({ properties: { foo: { type: 'string' } } })
    const b = s({ properties: { bar: { type: 'number' } } })
    const result = mergeSchemas(a, b)
    expect(result.properties).toHaveProperty('foo')
    expect(result.properties).toHaveProperty('bar')
  })

  it('deduplicates required arrays', () => {
    const result = mergeSchemas(
      s({ required: ['foo', 'bar'] }),
      s({ required: ['bar', 'baz'] })
    )
    expect(result.required).toEqual(['foo', 'bar', 'baz'])
  })

  it('returns base when extra is undefined', () => {
    const base = s({ type: 'object' })
    expect(mergeSchemas(base, undefined)).toEqual(base)
  })
})

describe('resolveEffectiveSchema - dependencies', () => {
  const schema = s({
    type: 'object',
    properties: {
      useAuth: { type: 'boolean' },
      token: { type: 'string' },
    },
    dependencies: {
      useAuth: {
        properties: { token: { type: 'string', minLength: 10 } },
        required: ['token'],
      },
    },
  })

  it('does NOT activate when trigger field is absent', () => {
    const result = resolveEffectiveSchema(schema, {})
    expect(result.required ?? []).not.toContain('token')
  })

  it('activates schema dependency when trigger field has a value', () => {
    const result = resolveEffectiveSchema(schema, { useAuth: true })
    expect(result.required).toContain('token')
  })
})

describe('resolveEffectiveSchema - if/then/else', () => {
  const schema = s({
    type: 'object',
    properties: { mode: { type: 'string', enum: ['basic', 'advanced'] } },
    if: { properties: { mode: { const: 'advanced' } } },
    then: {
      properties: { debugLevel: { type: 'integer' } },
      required: ['debugLevel'],
    },
    else: {},
  })

  it('applies then-branch when condition passes', () => {
    const result = resolveEffectiveSchema(schema, { mode: 'advanced' })
    expect(result.properties).toHaveProperty('debugLevel')
    expect(result.required).toContain('debugLevel')
  })

  it('does NOT apply then-branch when condition fails', () => {
    const result = resolveEffectiveSchema(schema, { mode: 'basic' })
    expect(result.properties).not.toHaveProperty('debugLevel')
  })

  it('removes if/then/else keys from returned schema', () => {
    const result = resolveEffectiveSchema(schema, {})
    expect(result).not.toHaveProperty('if')
    expect(result).not.toHaveProperty('then')
    expect(result).not.toHaveProperty('else')
  })
})

describe('resolveEffectiveSchema - allOf', () => {
  it('merges all sub-schemas and removes allOf key', () => {
    const schema = s({
      type: 'object',
      properties: { a: { type: 'string' } },
      allOf: [
        { properties: { b: { type: 'number' } } },
        { properties: { c: { type: 'boolean' } } },
      ],
    })
    const result = resolveEffectiveSchema(schema, {})
    expect(result.properties).toHaveProperty('a')
    expect(result.properties).toHaveProperty('b')
    expect(result.properties).toHaveProperty('c')
    expect(result.allOf).toBeUndefined()
  })
})