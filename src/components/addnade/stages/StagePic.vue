<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<div class="flex justify-between border-b border-slate-100 pb-2">
			<p class="text-xl font-medium">上传图片</p>

			<div class="flex gap-4">
				<div @click="handleGoPrev" class="flex items-center rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">
					<Icon :size="30" color="#cdd0d1">
						<AngleLeft />
					</Icon>
				</div>
				<button @click="handleSubmit" class="px-2 rounded-md bg-green-100 hover:bg-green-200 cursor-pointer">
					提交
				</button>
			</div>
		</div>

		<div class="flex flex-col items-center gap-4 mt-4">
			<div class="relative rounded-lg ring-2 "
				:class="hasError.lineup ? 'animate-wiggle ring-red-300' : 'ring-slate-300'">
				<div @click="lineupImageInput.click()"
					:class="lineupImageUrl ? 'top-2 right-2' : 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'"
					class="w-max absolute flex flex-col items-center ring-1 ring-slate-200 rounded-md bg-white hover:bg-gray-200 px-1 py-1 cursor-pointer">
					<Icon :size="lineupImageUrl ? 30 : 40" color="#cdd0d1">
						<FileUpload />
					</Icon>

					<p v-if="!lineupImageUrl">瞄点图</p>
				</div>

				<input @change="(e) => handleImageChange(e, 'lineup')" type="file" hidden ref="lineupImageInput"
					accept="image/jpg, image/jpeg, image/png, image/webp">

				<img v-if="lineupImageUrl" :src="lineupImageUrl" class="rounded-lg">
				<div v-else class="w-[300px] h-[200px] rounded-lg bg-gray-100"></div>
			</div>

			<div class="relative rounded-lg ring-2 "
				:class="hasError.result ? 'animate-wiggle ring-red-300' : 'ring-slate-300'">
				<div @click="resultImageInput.click()"
					:class="resultImageUrl ? 'top-2 right-2' : 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'"
					class="w-max absolute flex flex-col items-center ring-1 ring-slate-200 rounded-md bg-white hover:bg-gray-200 px-1 py-1 cursor-pointer">
					<Icon :size="resultImageUrl ? 30 : 40" color="#cdd0d1">
						<FileUpload />
					</Icon>

					<p v-if="!resultImageUrl">效果图</p>
				</div>

				<input @change="(e) => handleImageChange(e, 'result')" type="file" hidden ref="resultImageInput"
					accept="image/jpg, image/jpeg, image/png, image/webp">

				<img v-if="resultImageUrl" :src="resultImageUrl" class="rounded-lg">
				<div v-else class="w-[300px] h-[200px] rounded-lg bg-gray-100"></div>
			</div>

		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, reactive } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { Icon } from '@vicons/utils'
import { AngleLeft, FileUpload } from '@vicons/fa'

const { setActive, setFinished, commitStagePic,submitNade } = useProgressStore()

const hasError = reactive({
	lineup: false,
	result: false
})

let resetTimer: number

let lineupImage: Blob
const lineupImageInput = ref()
const lineupImageUrl = ref('')
let resultImage: Blob
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
			lineupImage = file
			lineupImageUrl.value = url
		} else if (type === 'result') {
			resultImage = file
			resultImageUrl.value = url
		}
	}
}

async function handleGoPrev() {
	setActive(3)
}

async function handleSubmit() {

	if (!lineupImageUrl.value) {
		hasError.lineup = true
	}

	if (!resultImageUrl.value) {
		hasError.result = true
	}
	resetTimer = setTimeout(() => resetErrors(), 2000)

	if (lineupImageUrl.value && resultImageUrl.value) {
		setFinished(4)
		commitStagePic({ lineupImage, resultImage })
		await submitNade()
	}
}

function resetErrors() {
	hasError.lineup = false
	hasError.result = false
}

onUnmounted(() => {
	clearTimeout(resetTimer)
})
</script>