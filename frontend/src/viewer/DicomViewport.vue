<template>
  <div class="dicom-viewport">
    <div v-show="error" class="error">{{ error }}</div>
    <div v-show="loading && !error" class="loading">Loading DICOM...</div>
    <div ref="elementRef" class="viewport-element" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RenderingEngine, Enums } from '@cornerstonejs/core'
import { initCornerstone, getSeriesImageIds } from '@/composables/useCornerstone.js'

// hardcoded test data, need to change later
const WADO_RS_ROOT = 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb'
const STUDY_UID = '2.16.840.1.114362.1.11972228.22789312658.616067305.306.2'
const SERIES_UID = '2.16.840.1.114362.1.11972228.22789312658.616067305.306.3'

const elementRef = ref(null)
const loading = ref(true)
const error = ref(null)

let renderingEngine = null
const RENDERING_ENGINE_ID = 'dicomRenderingEngine'
const VIEWPORT_ID = 'CT_STACK'

onMounted(async () => {
  try {
    console.log('[dicom] init start')
    await initCornerstone()
    console.log('[dicom] init done')

    const imageIds = await getSeriesImageIds(WADO_RS_ROOT, STUDY_UID, SERIES_UID)
    console.log('[dicom] imageIds', imageIds.length, imageIds[0])

    renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID)

    // STACK viewport: renders one 2-D frame at a time (simpler than VOLUME)
    renderingEngine.enableElement({
      viewportId: VIEWPORT_ID,
      type: Enums.ViewportType.STACK,
      element: elementRef.value,
    })
    console.log('[dicom] element enabled')

    const viewport = renderingEngine.getViewport(VIEWPORT_ID)
    // Load all imageIds into the stack and display the first frame
    console.log('[dicom] calling setStack')
    await viewport.setStack(imageIds, 0)
    console.log('[dicom] setStack done')
    viewport.render()

    loading.value = false
  } catch (e) {
    console.error('[dicom] error', e)
    error.value = e.message
    loading.value = false
  }
})

onBeforeUnmount(() => {
  // Clean up the WebGL context and cancel any in-flight requests
  renderingEngine?.destroy()
})
</script>

<style scoped>
.dicom-viewport {
  width: 100%;
  height: 100vh;
  background: #000;
  position: relative;
}

.viewport-element {
  width: 100%;
  height: 100%;
}

.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-family: monospace;
  font-size: 14px;
  z-index: 1;
}

.error {
  color: #f66;
}
</style>
