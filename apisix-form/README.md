# APISIX Schema Form

GSoC 2026 — JSON Schema to Form UI renderer for the APISIX Dashboard.

Renders plugin configuration forms directly from JSON Schema — no manual UI code needed per plugin.

## Features

- All JSON Schema types: `string`, `number`, `integer`, `boolean`, `object`, `array`
- `enum` → select dropdown or radio group
- `oneOf` → tab switcher with state isolation
- `dependencies` + `if/then/else` → conditional fields
- Live AJV validation with field-level errors
- Extensible widget registry

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # run tests
```


## Structure

```
src/
├── SchemaForm.vue           # Root component
├── WidgetResolver.vue       # Schema type → widget map
├── conditional-resolver.ts  # allOf / dependencies / if-then-else
├── useSchemaValidation.ts   # AJV validation composable
└── widgets/                 # TextInput, NumberInput, Toggle,
                             # SelectInput, RadioGroup, ArrayField,
                             # ObjectFieldset, OneOfSelector
tests/
├── conditional-resolver.test.ts
└── useSchemaValidation.test.ts
```
