<template>
  <div>
    <v-stage :config="{ width: 850, height: 850, scaleX: 0.6, scaleY: 0.6 }">
      <v-layer>
        <v-image :config="{ image: mapImage }"></v-image>
      </v-layer>

      <v-layer v-if="boardType === 'landspot'">
        <v-circle
          @click="selectLandSpot(landSpot)"
          @mouseenter="(e: Konva.KonvaEventObject<MouseEvent>) => handleLandSpotCursor(landSpot, e)"
          @mouseleave="(e: Konva.KonvaEventObject<MouseEvent>) => handleLandSpotCursor(landSpot, e)"
          v-for="landSpot in landSpotsExt"
          :config="landSpot.config"
        >
        </v-circle>
      </v-layer>

      <!-- start areas -->
      <v-layer v-else>
        <v-line
          @click="selectStartArea(startArea)"
          @mouseenter="(e: Konva.KonvaEventObject<MouseEvent>) => handleStartAreaCursor(startArea, e)"
          @mouseleave="(e: Konva.KonvaEventObject<MouseEvent>) => handleStartAreaCursor(startArea, e)"
          v-for="startArea in startAreasExt"
          :config="startArea.config"
        >
        </v-line>
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from "vue"
import type {
  StartArea,
  StartAreaExt,
  LandSpot,
  LandSpotExt,
  DataStartArea,
  DataLandSpot,
  Nade,
} from "@/types"
import Konva from "konva"
import axiosClient from "@/axios"
import type { AxiosResponse } from "axios"

const emits = defineEmits(["startAreaChange", "landSpotChange"])
const props = defineProps<{
  map: string
  nadeType: string
}>()

const boardType = ref("landspot")

const mapImage = ref<HTMLImageElement>()

const nades = ref<Nade[]>([])
const selectedNades = computed(() => {})

const startAreas = ref<StartArea[]>([])
// start areas shown after a land spot is selected
const startAreasExt = computed(() => {
  let nadesFromLandSpot = nades.value.filter(
    (nade) => nade.landSpotId === selectedLandSpotId.value
  )
  let countMap: { [index: string]: number } = {}
  nadesFromLandSpot.forEach((nade) => {
    let id = nade.startAreaId
    countMap[id] = countMap[id] ? countMap[id] + 1 : 0
  })
  const startAreaIds = new Set(nadesFromLandSpot.map((nade) => nade.startAreaId))
  return startAreas.value
    .filter((startArea) => startAreaIds.has(startArea._id))
    .map((startArea) => ({
      nadeCount: countMap[startArea._id],
      ...startArea,
    }))
})

const landSpots = ref<LandSpot[]>([])
// land spots with nade counts
const landSpotsExt = computed(() => {
  let countMap: { [index: string]: number } = {}
  nades.value.forEach((nade) => {
    let id = nade.landSpotId
    countMap[id] = countMap[id] ? countMap[id] + 1 : 0
  })
  return landSpots.value.map((landSpot) => ({
    nadeCount: countMap[landSpot._id],
    ...landSpot,
  }))
})
const selectedLandSpotId = ref("")

onBeforeMount(() => {
  loadNadeData(props.map, props.nadeType)
})

watch([() => props.map, () => props.nadeType], ([map, nadeType]) => {
  loadNadeData(map, nadeType)
})

function loadNadeData(map: string, nadeType: string) {
  const image = new Image()

  image.src = `./radars/${map}.svg`
  image.onload = () => {
    mapImage.value = image
  }

  axiosClient
    .get(`/nade?map=${map}&nadeType=${nadeType}`)
    .then((result: AxiosResponse<Nade[]>) => {
      nades.value = result.data
    })

  // get start areas data
  axiosClient
    .get(`/startarea?map=${map}&type=${nadeType}`)
    .then((result: AxiosResponse<DataStartArea[]>) => {
      result.data.forEach((entry) => {
        const points: number[] = []
        entry.coordinates.split(";").forEach((coord) => {
          const [x, y] = coord.split(",").map(parseFloat)
          points.push(x)
          points.push(y)
        })

        startAreas.value.push({
          ...entry,
          config: {
            points,
            fill: "rgba(236, 204, 104,0.5)",
            stroke: "#fff",
            closed: true,
          },
        })
      })
    })

  // get land spots data
  axiosClient
    .get(`/landspot?map=${map}&type=${nadeType}`)
    .then((result: AxiosResponse<DataLandSpot[]>) => {
      result.data.forEach((entry) => {
        const [x, y] = entry.coordinates.split(",").map(parseFloat)
        landSpots.value.push({
          ...entry,
          config: {
            x,
            y,
            radius: 20,
            fill: "rgba(236, 204, 104,0.5)",
            stroke: "#fff",
          },
        })
      })
    })
}

function selectLandSpot(landSpot: LandSpotExt) {
  boardType.value = "startarea"
  selectedLandSpotId.value = landSpot._id
}

function selectStartArea(startArea: StartAreaExt) {}

function handleStartAreaCursor(
  startArea: StartArea,
  e: Konva.KonvaEventObject<MouseEvent>
) {
  const stage = e.target.getStage()

  if (stage) {
    if (e.type === "mouseenter") {
      startArea.config.fill = "rgba(112, 161, 255, 0.7)"
      stage.container().style.cursor = "pointer"
    }

    if (e.type === "mouseleave") {
      startArea.config.fill = "rgba(236, 204, 104,0.5)"
      stage.container().style.cursor = "default"
    }
  }
}

function handleLandSpotCursor(
  landSpot: LandSpot,
  e: Konva.KonvaEventObject<MouseEvent>
) {
  const stage = e.target.getStage()

  if (stage) {
    if (e.type === "mouseenter") {
      landSpot.config.fill = "rgba(29, 209, 161, 0.5)"
      stage.container().style.cursor = "pointer"
    }

    if (e.type === "mouseleave") {
      landSpot.config.fill = "rgba(236, 204, 104,0.5)"
      stage.container().style.cursor = "default"
    }
  }
}
</script>
