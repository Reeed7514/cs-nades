<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<p class="text-xl font-medium w-full border-b border-slate-100 pb-4">位置信息</p>

		<div class="mx-auto w-max flex gap-4 mt-2">
			<button @click="boardType = 'start'"
				class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择起始位置</button>
			<button @click="boardType = 'end'" class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择落点</button>
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


		<div class="mx-auto mt-2 w-max">
			<p class="text-red-400">{{ validateError }}</p>
		</div>


		<div class="mx-auto mt-4 w-max ring-2 ring-slate-300 rounded-lg bg-gray-50 hover:bg-gray-100">

			<MapBoard :board-type="boardType" @start-area-change="handleStartAreaChange"
				@land-spot-change="handleLandSpotChange" />


		</div>

		<div class="mx-auto w-max mt-4">
			<button @click="handleGoPrev" :disabled="validating"
				class="border border-slate-200 rounded-md px-2 w-20 h-10 hover:bg-blue-200">上一个</button>
			<button @click="handleGoNext" :disabled="validating"
				class="border border-slate-200 rounded-md px-2 ml-4 w-20 h-10 hover:bg-blue-200">下一个</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import MapBoard from './MapBoard.vue'
import type { StartArea, LandSpot } from '@/types'
import Schema from 'async-validator'
import { useProgressStore } from '@/stores/progress';
import type { Rules, ValidateError, Values } from 'async-validator'

const { setActive, setFinished } = useProgressStore()


const locationData = reactive<Record<string, string>>({
	startAreaId: '',
	startCallout: '',
	landSpotId: '',
	endCallout: ''
})

const boardType = ref('start')

const validating = ref(false)
const validateError = ref('')

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
	validating.value = true

	const validator = new Schema(descriptor)

	try {
		await validator.validate({
			startAreaId: locationData.startAreaId,
			landSpotId: locationData.landSpotId
		})

		validating.value = false
		setFinished(3)
		setActive(4)

	} catch ({ errors, fields }: any) {
		handleErrors(errors, fields)
	}
}

function handleErrors(errors: ValidateError[], fields: Values) {
	if ('startAreaId' in fields) {
		validateError.value = fields.startAreaId[0].message;

		// console.log(validateErrors.spcmd);

	}

	if ('landSpotId' in fields) {
		validateError.value = fields.landSpotId[0].message

		// console.log(validateErrors.description)
	}

	validating.value = false
}

function handleStartAreaChange(startArea: StartArea) {
	boardType.value = 'end'
	locationData.startAreaId = startArea.id
	locationData.startCallout = startArea.calloutName
}

function handleLandSpotChange(landSpot: LandSpot) {
	locationData.landSpotId = landSpot.id
	locationData.endCallout = landSpot.calloutName
}

</script>