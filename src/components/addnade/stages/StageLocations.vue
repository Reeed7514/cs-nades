<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<p class="text-xl font-medium w-full border-b border-slate-100 pb-4">位置信息</p>

		<div class="mx-auto w-max flex gap-4 mt-2">
			<button @click="boardType = 'start'" class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择起始位置</button>
			<button @click="boardType = 'end'" class="border border-slate-200 p-1 rounded-md hover:bg-gray-200">选择落点</button>
		</div>

		<div class="flex gap-3 my-2 mx-auto w-max">
			<p>从</p>
			<p v-if="locationData.startCallout" class="font-medium border-b border-slate-300">{{ locationData.startCallout }}</p>
			<p v-else class="w-8 border-b border-slate-300"></p>
			<p>扔到</p>
			<p v-if="locationData.endCallout" class="font-medium border-b border-slate-300">{{ locationData.endCallout }}</p>
			<p v-else class="w-8 border-b border-slate-300"></p>
		</div>


		<div class="mx-auto mt-4 w-max border-2 border-slate-200 rounded-md bg-gray-50 hover:bg-gray-100">

			<MapBoard :board-type="boardType" @start-area-change="id => locationData.startAreaId = id" />
			
			
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import MapBoard from './MapBoard.vue'

const locationData = reactive<Record<string, string>>({
	startAreaId: '',
	startCallout: '',
	landSpotId: '',
	endCallout: ''
}) 

const boardType = ref('start')

</script>