<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<p class="text-xl font-medium w-full border-b border-slate-100 pb-4">上传图片</p>


		<div class="space-y-6 mt-4">
			<div>
				<button @click="lineupImageInput.click()" :class="hasError.lineup ? 'animate-wiggle ring-2 ring-red-400' : ''"
					class="px-2 py-1 rounded-lg hover:bg-gray-200 ring-1 ring-slate-200">瞄点图</button>

				<input @change="(e) => handleImageChange(e, 'lineup')" type="file" hidden ref="lineupImageInput"
					accept="image/jpg, image/jpeg, image/png, image/webp">

				<img v-if="lineupImageUrl" :src="lineupImageUrl" class="mt-2 rounded-lg ring-2 ring-slate-300">
			</div>


			<div>
				<button @click="resultImageInput.click()" :class="hasError.result ? 'animate-wiggle ring-2 ring-red-400' : ''"
					class="px-2 py-1 rounded-lg hover:bg-gray-200 ring-1 ring-slate-200">效果图</button>

				<input @change="(e) => handleImageChange(e, 'result')" type="file" hidden ref="resultImageInput"
					accept="image/jpg, image/jpeg, image/png, image/webp">

				<img v-if="resultImageUrl" :src="resultImageUrl" class="mt-2 rounded-lg ring-2 ring-slate-300">
			</div>
		</div>



		<div class="mx-auto w-max mt-4">
			<button @click="handleGoPrev" :disabled="validating"
				class="border border-slate-200 rounded-md px-2 w-20 h-10 hover:bg-blue-200">上一个</button>
			<button @click="handleSubmit" :disabled="validating"
				class="border border-slate-200 rounded-md px-2 ml-4 w-20 h-10 hover:bg-blue-200">提交</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { useProgressStore } from '@/stores/progress'

const { setActive, setFinished } = useProgressStore()

const validating = ref(false)

const hasError = reactive({
	lineup: false,
	result: false
})

const lineupImageInput = ref()
const lineupImageUrl = ref('')
const resultImageInput = ref()
const resultImageUrl = ref('')


function handleImageChange(e: Event, type: string) {
	const target = e.target as HTMLInputElement

	const file = target.files?.[0] as Blob

	const reader = new FileReader()

	reader.readAsDataURL(file)

	reader.onload = (e) => {
		let url = e.target?.result as string

		if (type === 'lineup') {
			lineupImageUrl.value = url
		} else if (type === 'result') {
			resultImageUrl.value = url
		}
	}
}

async function handleGoPrev() {
	setActive(3)
}

function handleSubmit() {

	if (!lineupImageUrl.value) {
		hasError.lineup = true
	}

	if (!resultImageUrl.value) {
		hasError.result = true
	}
	setTimeout(() => resetErrors(), 2000)

	if(lineupImageUrl.value && resultImageUrl.value){

	}


}

function resetErrors() {
	hasError.lineup = false
	hasError.result = false
}
</script>