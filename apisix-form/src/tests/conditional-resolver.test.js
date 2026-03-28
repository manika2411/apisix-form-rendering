import { describe, it, expect } from 'vitest'
import { resolveEffectiveSchema, mergeSchemas } from '../src/conditional-resolver'

describe('mergeSchemas', () => {
  it('merges properties from both schemas', () => {
    const a = { properties: { foo: { type: 'string' } } }
    const b = { properties: { bar: { type: 'number' } } }
    const result = mergeSchemas(a, b)
    expect(result.properties).toHaveProperty('foo')
    expect(result.properties).toHaveProperty('bar')
  })

  it('deduplicates required arrays', () => {
    const result = mergeSchemas(
      { required: ['foo', 'bar'] },
      { required: ['bar', 'baz'] }
    )
    expect(result.required).toEqual(['foo', 'bar', 'baz'])
  })

  it('returns base when extra is undefined', () => {
    const base = { type: 'object' }
    expect(mergeSchemas(base, undefined)).toEqual(base)
  })
})

describe('resolveEffectiveSchema - dependencies', () => {
  const schema = {
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
  }

  it('does NOT activate when trigger field is absent', () => {
    const result = resolveEffectiveSchema(schema as any, {})
    expect(result.required ?? []).not.toContain('token')
  })

  it('activates schema dependency when trigger field has a value', () => {
    const result = resolveEffectiveSchema(schema as any, { useAuth: true })
    expect(result.required).toContain('token')
  })
})

describe('resolveEffectiveSchema - if/then/else', () => {
  const schema = {
    type: 'object',
    properties: { mode: { type: 'string', enum: ['basic', 'advanced'] } },
    if: { properties: { mode: { const: 'advanced' } } },
    then: {
      properties: { debugLevel: { type: 'integer' } },
      required: ['debugLevel'],
    },
    else: {},
  }

  it('applies then-branch when condition passes', () => {
    const result = resolveEffectiveSchema(schema as any, { mode: 'advanced' })
    expect(result.properties).toHaveProperty('debugLevel')
    expect(result.required).toContain('debugLevel')
  })

  it('does NOT apply then-branch when condition fails', () => {
    const result = resolveEffectiveSchema(schema as any, { mode: 'basic' })
    expect(result.properties).not.toHaveProperty('debugLevel')
  })

  it('removes if/then/else keys from returned schema', () => {
    const result = resolveEffectiveSchema(schema as any, {})
    expect(result).not.toHaveProperty('if')
    expect(result).not.toHaveProperty('then')
    expect(result).not.toHaveProperty('else')
  })
})

describe('resolveEffectiveSchema - allOf', () => {
  it('merges all sub-schemas and removes allOf key', () => {
    const schema = {
      type: 'object',
      properties: { a: { type: 'string' } },
      allOf: [
        { properties: { b: { type: 'number' } } },
        { properties: { c: { type: 'boolean' } } },
      ],
    }
    const result = resolveEffectiveSchema(schema as any, {})
    expect(result.properties).toHaveProperty('a')
    expect(result.properties).toHaveProperty('b')
    expect(result.properties).toHaveProperty('c')
    expect(result.allOf).toBeUndefined()
  })
})