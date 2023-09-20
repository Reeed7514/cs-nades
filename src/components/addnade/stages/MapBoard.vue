<template>
	<div>
		<v-stage :config="{ width: 600, height: 600, scaleX: 0.6, scaleY: 0.6 }">

			<v-layer>
				<v-image :config="{ image: mapImage }"></v-image>
			</v-layer>

			<!-- start areas -->
			<v-layer v-if="props.boardType === 'start'">
				<v-line @click="handleClickStartArea(startArea)" @mouseenter="startArea.config.fill = 'rgba(112, 161, 255, 0.7)'"
					@mouseleave="startArea.config.fill = 'rgba(236, 204, 104,0.5)'" v-for="startArea in startAreas"
					:config="startArea.config">
				</v-line>
			</v-layer>

			<v-layer v-else>
				<v-line @click="handleClickLandSpot(landSpot)" @mouseenter="landSpot.config.fill = 'rgba(123, 237, 159,0.5)'"
					@mouseleave="landSpot.config.fill = 'rgba(236, 204, 104,0.5)'" v-for="landSpot in landSpots"
					:config="landSpot.config">
				</v-line>
			</v-layer>

		</v-stage>
	</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

interface DataStartArea {
	id: string,
	calloutName: string,
	map: string,
	position: { x: number, y: number }[]
}

interface ConfigStartArea {
	points: number[],
	fill: string,
	stroke: string,
	closed: boolean
}

interface StartArea {
	id: string,
	config: ConfigStartArea
}

interface DataLandSpot {
	id: string,
	calloutName: string,
	map: string,
	position: { x: number, y: number },
	type: string
}

interface ConfigLandSpot {
	x: number,
	y: number,
	radius: number,
	fill: string,
	stroke: string
}

interface LandSpot {
	id: string,
	config: ConfigLandSpot
}

const emits = defineEmits(['startAreaChange', 'landSpotChange'])
const props = defineProps<{
	boardType: string
}>()

const mapImage = ref<HTMLImageElement>()
const startAreas = ref<StartArea[]>([])
const landSpots = ref<LandSpot[]>([])


onBeforeMount(() => {
	const image = new Image()

	image.src = './radars/mirage.svg'
	image.onload = () => {
		mapImage.value = image
	}

	// get start areas data
	fetch('./jsons/startAreas_mirage.json')
		.then(response => response.json())
		.then((data: DataStartArea[]) => {
			data.forEach(entry => {
				const points: number[] = []
				entry.position.forEach(coord => {
					points.push(coord.x)
					points.push(coord.y)
				})

				startAreas.value.push({
					id: entry.id,
					config: {
						points,
						fill: 'rgba(236, 204, 104,0.5)',
						stroke: '#fff',
						closed: true
					}
				})
			})
		})
	
	// get land spots data
	fetch('./jsons/landSpots_mirage.json')
		.then(response => response.json())
		.then((data: DataLandSpot[]) => {
			data.forEach(entry => {
				
				landSpots.value.push({
					id: entry.id,
					config: {
						x: entry.position.x,
						y: entry.position.y,
						radius: 15,
						fill: 'rgba(123, 237, 159,0.5)',
						stroke: '#fff'
					}
				})
			})
		})


})


function handleClickStartArea(startArea: StartArea) {
	emits('startAreaChange', startArea.id)
}

function handleClickLandSpot(landSpot: LandSpot){
	emits('landSpotChange', landSpot.id)
}
</script>