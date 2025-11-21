<template>
  <div class="deforumation">
    <header class="deforumation__header">
      <div>
        <h1>Deforumation QT</h1>
        <p>Real-time steering interface for Deforum renders.</p>
      </div>
      <Button label="Send update" icon="pi pi-send" @click="pushUpdate" />
    </header>

    <section class="panel">
      <h3>Prompt control</h3>
      <Textarea v-model="state.prompt" rows="3" auto-resize @input="queueUpdate" />
      <div class="row">
        <label>Frame</label>
        <InputNumber v-model="state.frame" :min="0" @input="queueUpdate" />
      </div>
    </section>

    <section class="panel">
      <h3>Camera</h3>
      <div class="grid">
        <div class="row">
          <label>Yaw</label>
          <InputNumber v-model="state.camera.yaw" :step="0.1" @input="queueUpdate" />
        </div>
        <div class="row">
          <label>Pitch</label>
          <InputNumber v-model="state.camera.pitch" :step="0.1" @input="queueUpdate" />
        </div>
        <div class="row">
          <label>Roll</label>
          <InputNumber v-model="state.camera.roll" :step="0.1" @input="queueUpdate" />
        </div>
        <div class="row">
          <label>Zoom</label>
          <InputNumber v-model="state.camera.zoom" :min="0.1" :step="0.05" @input="queueUpdate" />
        </div>
      </div>
    </section>

    <section class="panel">
      <h3>Noise & Guidance</h3>
      <div class="row">
        <label>Noise schedule</label>
        <InputNumber v-model="state.noise" :min="0" :max="1" :step="0.01" @input="queueUpdate" />
      </div>
      <div class="row">
        <label>CFG</label>
        <InputNumber v-model="state.guidance" :min="1" :max="25" :step="0.5" @input="queueUpdate" />
      </div>
    </section>

    <section class="panel">
      <h3>Timeline bumps</h3>
      <div class="row">
        <label>Schedule</label>
        <InputText v-model="state.timeline" placeholder="e.g. 0:(1), 12:(1.5)" @input="queueUpdate" />
      </div>
    </section>

    <Message v-if="statusMessage" severity="success" :closable="false">{{ statusMessage }}</Message>
    <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import DeforumControlService from '@/services/deforum/DeforumControlService'

const state = reactive({
  prompt: '',
  frame: 0,
  camera: {
    yaw: 0,
    pitch: 0,
    roll: 0,
    zoom: 1,
  },
  noise: 0.12,
  guidance: 7,
  timeline: '0:(1)'
})

const statusMessage = ref('')
const errorMessage = ref('')
let debounceTimer

function queueUpdate() {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    pushUpdate()
  }, 350)
}

async function pushUpdate() {
  try {
    await DeforumControlService.sendLiveUpdate(structuredClone(state))
    statusMessage.value = `Update sent at ${new Date().toLocaleTimeString()}`
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = err.message
    statusMessage.value = ''
  }
}

async function loadStatus() {
  try {
    const { data } = await DeforumControlService.getLiveStatus()
    if (data) {
      Object.assign(state, data)
    }
  } catch (err) {
    // Status endpoint is optional; only surface actionable errors
    console.warn('Deforum status unavailable', err)
  }
}

onMounted(() => {
  loadStatus()
})

onBeforeUnmount(() => {
  window.clearTimeout(debounceTimer)
})
</script>

<style scoped>
.deforumation {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.deforumation__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel {
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--surface-card);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
}
label {
  min-width: 120px;
  font-weight: 600;
}
</style>
