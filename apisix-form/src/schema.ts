import type { JSONSchema7 } from 'json-schema'

export const schema: JSONSchema7 = {
  type: 'object',
  title: 'limit-req Plugin',
  required: ['rate', 'burst'],
  properties: {
    rate: {
      type: 'number',
      title: 'Rate',
      description: 'Requests per second allowed. Must be > 0.',
      minimum: 0,
      exclusiveMinimum: 0,
    },
    burst: {
      type: 'integer',
      title: 'Burst',
      description: 'Number of extra requests allowed to exceed the rate briefly.',
      minimum: 0,
    },
    key: {
      type: 'string',
      title: 'Key',
      description: 'The user specified key to limit the request.',
      enum: ['remote_addr', 'server_addr', 'http_x_real_ip', 'http_x_forwarded_for', 'consumer_name'],
      default: 'remote_addr',
    },
    rejected_code: {
      type: 'integer',
      title: 'Rejected Code',
      description: 'HTTP status code returned when request is rejected.',
      minimum: 200,
      maximum: 599,
      default: 503,
    },
    rejected_msg: {
      type: 'string',
      title: 'Rejected Message',
      description: 'Custom response body when request is rejected.',
    },
    nodelay: {
      type: 'boolean',
      title: 'No Delay',
      description: 'If true, burst requests are not delayed.',
      default: false,
    },
    allow_degradation: {
      type: 'boolean',
      title: 'Allow Degradation',
      description: 'Allow plugin to be skipped when unavailable.',
      default: false,
    },
  },
}

export const oneOfSchema: JSONSchema7 = {
  type: 'object',
  title: 'jwt-auth Plugin',
  properties: {
    auth_type: { type: 'string', title: 'Auth Type', enum: ['key', 'jwt'] },
  },
  oneOf: [
    {
      title: 'Key Auth',
      properties: { key: { type: 'string', title: 'API Key', minLength: 8 } },
      required: ['key'],
    },
    {
      title: 'JWT Auth',
      properties: {
        secret: { type: 'string', title: 'JWT Secret' },
        exp: { type: 'integer', title: 'Expiry (seconds)', minimum: 1 },
      },
      required: ['secret'],
    },
  ],
}