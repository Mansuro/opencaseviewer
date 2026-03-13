import { metaData } from '@cornerstonejs/core'
import { init as csRenderInit } from '@cornerstonejs/core'
import { init as csToolsInit } from '@cornerstonejs/tools'
import { init as dicomImageLoaderInit, wadors } from '@cornerstonejs/dicom-image-loader'

// Tag 00080018 = SOPInstanceUID: uniquely identifies each DICOM instance
const SOP_INSTANCE_UID_TAG = '00080018'

// prevent re-initialising if multiple components call useCornerstone()
let initialised = false

// Must be called once before creating any viewports.
// Initialises core → tools → image-loader in the required order.
export async function initCornerstone() {
  if (initialised) return
  await csRenderInit()
  csToolsInit()
  dicomImageLoaderInit({ maxWebWorkers: 1 })
  // Wire the wadors metadata provider into Cornerstone's metadata registry
  metaData.addProvider(wadors.metaData.metaDataProvider)
  initialised = true
}

// Fetches DICOM JSON metadata for every instance in the given series,
// registers each instance's metadata with the wadors manager,
// and returns an array of wadors: imageIds ready for a STACK viewport.
export async function getSeriesImageIds(wadoRsRoot, studyUID, seriesUID) {
  const url = `${wadoRsRoot}/studies/${studyUID}/series/${seriesUID}/metadata`
  const res = await fetch(url, { headers: { Accept: 'application/dicom+json' } })
  if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`)
  const instances = await res.json()

  return instances.map((instance) => {
    const sopUID = instance[SOP_INSTANCE_UID_TAG]?.Value?.[0]
    if (!sopUID) throw new Error(`Instance at index ${i} is missing SOPInstanceUID`)
    const imageId = `wadors:${wadoRsRoot}/studies/${studyUID}/series/${seriesUID}/instances/${sopUID}/frames/1`
    // Register per-instance metadata so Cornerstone can decode pixel/spacing info
    wadors.metaDataManager.add(imageId, instance)
    return imageId
  })
}
