<template>
	<div class="w-4/5 p-6 border border-slate-200 rounded-md">
		<p class="text-xl font-medium w-full border-b border-slate-100 pb-4">上传视频</p>

		<div class="flex gap-4">

			<div>
				<div class="flex gap-2 items-center my-2">
					<p>视频链接</p>
					<span class="text-sm text-red-400">{{ urlError }}</span>
				</div>
				<input type="text" v-model="url" :class="urlError ? 'animate-wiggle ring-2 ring-red-400' : ''" class="border border-slate-200 w-96 h-10 outline-none px-2 rounded-md">
			</div>


			<div class="mt-12 bg-blue-200 rounded-md p-2">
				<p>Use caution when making use of Experimental features, particularly within modules. Users may not be aware that
					experimental features are being used. Bugs or behavior changes may surprise users when Experimental API
					modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag.
					Experimental features may also emit a warning.</p>
			</div>


		</div>

		<div class="mx-auto w-max mt-4">
			<button @click="handleGoNext" :disabled="validating"
				class="border border-slate-200 rounded-md px-2 w-20 h-10 hover:bg-blue-200">下一个</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProgressStore } from '@/stores/progress';
import { ref } from 'vue'
import Schema from 'async-validator'
import type { Rules, ValidateError, Values } from 'async-validator'

const url = ref('')
const urlError = ref('')
const validating = ref(false)
const { setFinished, setActive } = useProgressStore()

const descriptor: Rules = {
	videoUrl: {
		type: 'string',
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				if (!/^https?:\/\/.*/.test(value)) {
					reject('格式有误')
				} else {
					resolve()
				}
			})
		}
	}
}

async function handleGoNext() {
	validating.value = true

	const validator = new Schema(descriptor)
	try {
		await validator.validate({ videoUrl: url.value })


		validating.value = false
		setFinished(1)
		setActive(2)

	} catch ({ errors, fields }: any) {
		return handleErrors(errors, fields)
	}
}

function handleErrors(errors: ValidateError[], fields: Values) {
	// console.log(errors);
	
	if ('videoUrl' in fields) {
		urlError.value = fields.videoUrl[0].message

		setTimeout(() => urlError.value = '', 2000)
		// console.log(fields.videoUrl.message)
	}
	validating.value = false
}

</script>