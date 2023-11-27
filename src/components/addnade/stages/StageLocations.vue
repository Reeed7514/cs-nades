<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<div class="flex justify-between border-b border-slate-100 pb-2">
			<p class="text-xl font-medium">道具信息</p>

			<div class="flex gap-4">
				<div @click="handleGoPrev" class="flex items-center rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">
					<Icon :size="30" color="#cdd0d1">
						<AngleLeft />
					</Icon>
				</div>
				<div @click="handleGoNext" class="flex items-center rounded-md mr-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
					<Icon :size="30" color="#cdd0d1">
						<AngleRight />
					</Icon>
				</div>
			</div>
		</div>

		<div class="mx-auto w-max flex gap-4 mt-2">
			<button @click="boardType = 'start'" :class="hasError.startArea ? 'animate-wiggle ring-1 ring-red-300' : ''"
				class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择起始位置</button>
			<button @click="boardType = 'end'" :class="hasError.landSpot ? 'animate-wiggle ring-1 ring-red-300' : ''"
				class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择落点</button>
		</div>

		<div class="flex gap-3 my-2 mx-auto w-max">
			<p>从</p>
			<p v-if="locationData.startCallout" class="font-medium border-b border-slate-300">{{ locationData.startCallout }}
			</p>
			<p v-else class="w-8 border-b border-slate-300"></p>
			<p>扔到</p>
			<p v-if="locationData.endCallout" class="font-medium border-b border-slate-300">{{ locationData.endCallout }}</p>
			<p v-else class="w-8 border-b border-slate-300"></p>
		</div>


		<div class="mx-auto mt-4 w-max ring-2 ring-slate-300 rounded-lg bg-gray-50 hover:bg-gray-100">

			<MapBoard :board-type="boardType" @start-area-change="handleStartAreaChange"
				@land-spot-change="handleLandSpotChange" />


		</div>

	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue';
import MapBoard from './MapBoard.vue'
import { Icon } from '@vicons/utils'
import { AngleLeft, AngleRight } from '@vicons/fa';
import type { StartArea, LandSpot } from '@/types'
import Schema from 'async-validator'
import { useProgressStore } from '@/stores/progress';
import type { Rules, ValidateError, Values } from 'async-validator'

const { setActive, setFinished, commitStageLocations } = useProgressStore()


const locationData = reactive<Record<string, string>>({
	startAreaId: '',
	startCallout: '',
	landSpotId: '',
	endCallout: ''
})

const boardType = ref('start')

const hasError = reactive({
	startArea: false,
	landSpot: false
})

let resetTimer: number

function handleGoPrev() {
	setActive(2)
}

const descriptor: Rules = {
	startAreaId: {
		type: 'string',
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				value ? resolve() : reject('未选择起始位置')
			})
		}
	},
	landSpotId: {
		type: 'string',
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				value ? resolve() : reject('未选择落点')
			})
		}
	}
}

async function handleGoNext() {

	const validator = new Schema(descriptor)

	try {
		const data = {
			startAreaId: locationData.startAreaId,
			landSpotId: locationData.landSpotId
		}

		await validator.validate(data)

		commitStageLocations(data)
		setFinished(3)
		setActive(4)

	} catch ({ errors, fields }: any) {
		handleErrors(errors, fields)
	}
}

function handleErrors(errors: ValidateError[], fields: Values) {
	if ('startAreaId' in fields) {
		hasError.startArea = true
	}

	if ('landSpotId' in fields) {
		hasError.landSpot = true
	}

	resetTimer = setTimeout(() => resetErrors(), 2000)
}

function handleStartAreaChange(startArea: StartArea) {
	boardType.value = 'end'
	locationData.startAreaId = startArea._id
	locationData.startCallout = startArea.callout
}

function handleLandSpotChange(landSpot: LandSpot) {
	locationData.landSpotId = landSpot._id
	locationData.endCallout = landSpot.callout
}


function resetErrors() {
	hasError.startArea = false
	hasError.landSpot = false
}

onUnmounted(() => {
	clearTimeout(resetTimer)
})
</script>