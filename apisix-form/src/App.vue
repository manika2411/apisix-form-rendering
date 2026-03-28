<template>
  <div class="page">

    <!-- Plugin switcher -->
    <div class="plugin-tabs">
      <button
        v-for="p in plugins"
        :key="p.id"
        :class="['plugin-tab', { 'plugin-tab--active': activePlugin.id === p.id }]"
        @click="switchPlugin(p)"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="card">
      <div class="card__header">
        <div class="card__badge">APISIX Plugin</div>
        <h1 class="card__title">{{ activePlugin.schema.title }}</h1>
        <p class="card__subtitle">
          {{ activePlugin.schema.description ?? 'Configure plugin parameters below. Required fields are marked with *' }}
        </p>
      </div>

      <div class="card__body">
        <SchemaForm :key="activePlugin.id" v-model="config" :schema="activePlugin.schema" @submit="onSubmit" />
      </div>

      <div class="card__footer">
        <button class="btn btn--ghost" @click="config = {}">Reset</button>
        <button class="btn btn--primary" @click="onSubmit(config)">Save Configuration</button>
      </div>
    </div>

    <div class="preview">
      <div class="preview__label">Live JSON Output</div>
      <pre class="preview__code">{{ JSON.stringify(config, null, 2) }}</pre>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SchemaForm from './SchemaForm.vue'
import { plugins } from './schema'

export default defineComponent({
  name: 'App',
  components: { SchemaForm },
  setup() {
    const activePlugin = ref(plugins[0])
    const config = ref<Record<string, unknown>>({})

    function switchPlugin(p: typeof plugins[0]) {
      activePlugin.value = p
      config.value = {}
    }

    function onSubmit(value: Record<string, unknown>) {
      alert(JSON.stringify(value, null, 2))
    }

    return { plugins, activePlugin, config, switchPlugin, onSubmit }
  },
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f1f5f9;
  min-height: 100vh;
  color: #1e293b;
}

.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Plugin switcher ── */
.plugin-tabs {
  display: flex;
  gap: 0.5rem;
  background: #fff;
  padding: 0.4rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}
.plugin-tab {
  flex: 1;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #64748b;
  transition: all 0.15s;
}
.plugin-tab--active {
  background: #0f172a;
  color: #fff;
}
.plugin-tab:hover:not(.plugin-tab--active) {
  background: #f1f5f9;
}

/* ── Card ── */
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06);
  overflow: hidden;
}
.card__header {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  padding: 2rem 2rem 1.75rem;
  color: white;
}
.card__badge {
  display: inline-block;
  background: rgba(99,179,237,0.2);
  color: #93c5fd;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25em 0.75em;
  border-radius: 99px;
  border: 1px solid rgba(99,179,237,0.3);
  margin-bottom: 0.75rem;
}
.card__title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}
.card__subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
}
.card__body { padding: 2rem; }
.card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

/* ── Buttons ── */
.btn {
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.btn--primary { background: #2563eb; color: white; }
.btn--primary:hover { background: #1d4ed8; }
.btn--ghost { background: transparent; color: #64748b; border: 1px solid #e2e8f0; }
.btn--ghost:hover { background: #f1f5f9; }

/* ── Global inputs ── */
input[type="text"],
input[type="number"],
input[type="email"],
input[type="url"],
input[type="password"],
select {
  width: 100%;
  padding: 0.55rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1e293b;
  background: #f8fafc;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
input:focus, select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  background: #fff;
}

/* ── Preview ── */
.preview {
  background: #0f172a;
  border-radius: 12px;
  overflow: hidden;
}
.preview__label {
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid #1e293b;
}
.preview__code {
  padding: 1rem;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: #7dd3fc;
  line-height: 1.6;
  min-height: 60px;
}
</style>