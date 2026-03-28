import type { JSONSchema7 } from 'json-schema'

export const limitReqSchema: JSONSchema7 = {
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

export const jwtAuthSchema: JSONSchema7 = {
  type: 'object',
  title: 'jwt-auth Plugin',
  description: 'Authenticate requests using Key Auth or JWT. Select an auth type below.',
  oneOf: [
    {
      title: 'Key Auth',
      type: 'object',
      required: ['key'],
      properties: {
        key: {
          type: 'string',
          title: 'API Key',
          description: 'Unique key for the consumer. Must be at least 8 characters.',
          minLength: 8,
        },
        hide_credentials: {
          type: 'boolean',
          title: 'Hide Credentials',
          description: 'Strip the API key from the request before forwarding.',
          default: false,
        },
      },
    },
    {
      title: 'JWT Auth',
      type: 'object',
      required: ['secret'],
      properties: {
        secret: {
          type: 'string',
          title: 'JWT Secret',
          description: 'Secret used to sign and verify JWT tokens.',
          minLength: 1,
        },
        algorithm: {
          type: 'string',
          title: 'Algorithm',
          description: 'Signing algorithm.',
          enum: ['HS256', 'HS512', 'RS256'],
          default: 'HS256',
        },
        exp: {
          type: 'integer',
          title: 'Expiry (seconds)',
          description: 'Token expiry time in seconds.',
          minimum: 1,
          default: 86400,
        },
        base64_secret: {
          type: 'boolean',
          title: 'Base64 Secret',
          description: 'Set to true if the secret is base64 encoded.',
          default: false,
        },
      },
    },
  ],
}

export const plugins = [
  { id: 'limit-req', label: 'limit-req', schema: limitReqSchema },
  { id: 'jwt-auth',  label: 'jwt-auth',  schema: jwtAuthSchema  },
]