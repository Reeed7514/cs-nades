<template>
	<div>
		<v-stage :config="{ width: 600, height: 600, scaleX: 0.6, scaleY: 0.6 }">
			<v-layer>
				<v-image :config="{ image: mapImage }"></v-image>
			</v-layer>

			<!-- start areas -->
			<v-layer v-if="props.boardType === 'start'">
				<v-line @click="emits('startAreaChange', startArea)"
					@mouseenter="(e: Konva.KonvaEventObject<MouseEvent>) => handleStartAreaCursor(startArea, e)"
					@mouseleave="(e: Konva.KonvaEventObject<MouseEvent>) => handleStartAreaCursor(startArea, e)"
					v-for="startArea in startAreas" :config="startArea.config">
				</v-line>
			</v-layer>

			<v-layer v-else>
				<v-circle @click="emits('landSpotChange', landSpot)"
					@mouseenter="(e: Konva.KonvaEventObject<MouseEvent>) => handleLandSpotCursor(landSpot, e)"
					@mouseleave="(e: Konva.KonvaEventObject<MouseEvent>) => handleLandSpotCursor(landSpot, e)"
					v-for="landSpot in landSpots" :config="landSpot.config">
				</v-circle>
			</v-layer>
		</v-stage>
	</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import type { StartArea, LandSpot, DataStartArea, DataLandSpot } from "@/types"
import Konva from "konva"
import axiosClient from "@/axios"
import type { AxiosResponse } from "axios"
import { useProgressStore } from "@/stores/progress"

const emits = defineEmits(["startAreaChange", "landSpotChange"])
const props = defineProps<{
	boardType: string
}>()

const progressStore = useProgressStore()

const mapImage = ref<HTMLImageElement>()
const startAreas = ref<StartArea[]>([])
const landSpots = ref<LandSpot[]>([])

onBeforeMount(() => {
	const image = new Image()

	image.src = "./radars/mirage.svg"
	image.onload = () => {
		mapImage.value = image
	}
	const map = progressStore.utilInfo?.map
	const type = progressStore.utilInfo?.nadeType
	// get start areas data
	axiosClient
		.get(`/startarea?map=${map}`)
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
		.get(`/landspot?map=${map}&type=${type}`)
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
})

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
