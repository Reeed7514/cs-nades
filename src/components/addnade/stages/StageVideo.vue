<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<div class="flex justify-between border-b border-slate-100 pb-2">
			<p class="text-xl font-medium">上传视频</p>

			<div class="flex gap-4">
				<div @click="handleGoNext" class="flex items-center rounded-md mr-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
					<Icon :size="30" color="#cdd0d1">
						<AngleRight />
					</Icon>
				</div>
			</div>
		</div>


		<div class="flex flex-col items-center mt-8">

			<div @click="videoInput.click()" :class="hasError ? 'animate-wiggle ring-red-300' : 'ring-slate-200'"
				class="w-max ring-2  rounded-md bg-gray-50  hover:bg-gray-100 text-2xl p-3 cursor-pointer">
				<Icon :size="40" color="#cdd0d1">
					<FileUpload />
				</Icon>
			</div>

			<div class="mt-4">
				<!-- <div class="flex gap-2 items-center my-2">
					<p>视频链接</p>
					<span class="text-sm text-red-400">{{ urlError }}</span>
				</div> -->
				<!-- <input type="text" v-model="url" :class="urlError ? ' ring-2 ring-red-400' : ''" class="border border-slate-200 w-96 h-10 outline-none px-2 rounded-md"> -->
				<video v-if="videoUrl" :src="videoUrl" controls class="border  rounded-lg ring-2 ring-slate-500"></video>
				<input ref="videoInput" type="file" accept="video/*" hidden @change="handleVideoChange">
			</div>


			<div class="mt-8 w-2/3 bg-blue-100 rounded-md p-2">
				<p>1.请上传画面比例为16:9的视频。</p>
				<p>2.视频的大小请控制在50Mb以内。</p>
				<p>3.视频应当仅包含道具投掷的信息, 请不要录制与道具无关的画面。</p>
				<p>4.确保你的准星清晰可见。</p>
			</div>


		</div>
	</div>
</template>

<script setup lang="ts">
import { useProgressStore } from '@/stores/progress';
import { ref } from 'vue'
import { AngleRight, FileUpload } from '@vicons/fa'
import { Icon } from '@vicons/utils'

const videoInput = ref()
const videoUrl = ref('')

const hasError = ref(false)
const { setFinished, setActive, commitStageVideo } = useProgressStore()


function handleVideoChange(e: Event) {
	const target = e.target as HTMLInputElement

	const file = target.files?.[0] as Blob

	const reader = new FileReader()

	reader.readAsDataURL(file)

	reader.onload = (e) => {
		videoUrl.value = e.target?.result as string
		commitStageVideo(file)
	}
}

async function handleGoNext() {

	if (!videoUrl.value) {
		hasError.value = true

		setTimeout(() => hasError.value = false, 2000)
	} else {
		setFinished(1)
		setActive(2)
	}

}

</script>