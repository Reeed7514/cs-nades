<template>
	<div class="w-2/5 p-6 border border-slate-200 rounded-md">
		<!-- <p class="text-xl font-medium w-full border-b border-slate-100 pb-4">道具信息</p> -->
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
		<!-- info -->

		<div class="mt-2 mb-4">
			<p class="mb-1">地图</p>

			<select class="outline-none border border-slate-200 rounded-md py-1" v-model="formData.map">
				<option value="mirage" selected>荒漠迷城</option>
				<option value="inferno">炼狱小镇</option>
				<option value="overpass">死亡游乐园</option>
				<option value="ancient">远古遗迹</option>
				<option value="nuke">核子危机</option>
				<option value="vertigo">殒命大厦</option>
			</select>
		</div>

		<div class="mt-2 mb-4">
			<p class="mb-1">类型</p>
			<div class="flex w-max border border-slate-200 rounded-md overflow-auto cursor-pointer">
				<div @click="formData.nadeType = 'smoke'" :class="formData.nadeType === 'smoke' ? 'bg-gray-300' : ''"
					class="flex p-1 border-r border-slate-200 ">
					<Icon :size="30" color="#b2bec3">
						<Cloud />
					</Icon>
				</div>
				<div @click="formData.nadeType = 'flash'" :class="formData.nadeType === 'flash' ? 'bg-gray-300' : ''"
					class="flex p-1 border-r border-slate-200">
					<Icon :size="30" color="#f1c40f">
						<Flash />
					</Icon>
				</div>
				<div @click="formData.nadeType = 'molotov'" :class="formData.nadeType === 'molotov' ? 'bg-gray-300' : ''"
					class="flex p-1 border-r border-slate-200">
					<Icon :size="30" color="#f39c12">
						<Fire />
					</Icon>
				</div>
				<div @click="formData.nadeType = 'hegrenade'" :class="formData.nadeType === 'hegrenade' ? 'bg-gray-300' : ''"
					class="flex p-1">
					<Icon :size="30">
						<Bomb />
					</Icon>
				</div>
			</div>
		</div>


		<div class="mt-2 mb-4">
			<p class="mb-1">阵营</p>
			<div class="flex w-max border border-slate-200 rounded-md overflow-auto cursor-pointer">
				<p @click="formData.team = 't'" :class="formData.team === 't' ? 'bg-gray-300' : ''"
					class="py-2 px-[12px] border-r border-slate-200">
					T</p>
				<p @click="formData.team = 'ct'" :class="formData.team === 'ct' ? 'bg-gray-300' : ''" class="py-2 px-2">CT</p>
			</div>
		</div>

		<!-- pos and lineup -->

		<div class="mt-2 mb-4">
			<p class="mb-1">移动方式</p>

			<select class="outline-none border border-slate-200 rounded-md py-1" v-model="formData.movement">
				<option selected>静止</option>
				<option>向前移动</option>
				<option>静步向前移动</option>
				<option>蹲下</option>
				<option>蹲下向前移动</option>
			</select>
		</div>

		<div class="mt-2 mb-4">
			<p class="mb-1">投掷方式</p>

			<select class="outline-none border border-slate-200 rounded-md py-1" v-model="formData.throwType">
				<option selected>左键</option>
				<option>左键跳投</option>
				<option>右键</option>
				<option>右键跳投</option>
				<option>左右键组合</option>
				<option>左右键组合跳投</option>
			</select>
		</div>

		<div class="mt-2 mb-4">
			<div class="flex gap-2 items-center mb-1">
				<p>传送位置指令</p>
				<span class="text-sm text-red-400">{{ validateErrors.spcmd }}</span>
			</div>

			<input type="text" v-model="formData.spcmd" @input="validateErrors.spcmd = ''"
				:class="hasError.spcmd ? 'animate-wiggle ring-1 ring-red-300' : ''"
				class="w-full p-1 border border-slate-200 rounded-md outline-none">
		</div>


		<!-- 描述 -->
		<div class="border-t border-slate-200">
			<div class="mt-2 mb-4">

				<div class="flex gap-2 items-center mb-1">
					<p>描述</p>
					<span class="text-sm text-red-400">{{ validateErrors.description }}</span>
				</div>

				<textarea v-model="formData.description" @input="validateErrors.description = ''"
					:class="hasError.description ? 'animate-wiggle ring-1 ring-red-300' : ''"
					class="w-full outline-none resize-none border border-slate-200 rounded-md p-1 h-32"></textarea>
			</div>
		</div>


	</div>
</template>

<script setup lang="ts">
import { Cloud, Fire, Bomb, AngleLeft, AngleRight } from '@vicons/fa'
import { Flash } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils'
import { useProgressStore } from '@/stores/progress'
import { reactive, onUnmounted, ref } from 'vue'
import Schema from 'async-validator'
import type { Rules, ValidateError, Values } from 'async-validator'

const { setActive, setFinished, commitStageUtilInfo } = useProgressStore()


const formData = reactive<Record<string, string>>({
	map: 'mirage',
	nadeType: 'smoke',
	team: 't',
	movement: '静止',
	throwType: '左键',
	spcmd: 'setpos 8415.820313 -5248.870117 320.000000;setang -70.642090 71.564941 0.000000',
	description: 'xd'
})

const validateErrors = reactive<Record<string, string>>({
	spcmd: '',
	description: ''
})

const hasError = reactive({
	spcmd: false,
	description: false
})

let resetTimer: number

const descriptor: Rules = {
	spcmd: {
		type: 'string',
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				let pattern = /^setpos (-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+);setang (-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+)$/
				pattern.test(value) ? resolve() : reject('指令格式有误')
			})
		}
	},
	description: {
		type: 'string',
		required: true,
		asyncValidator: (rule, value) => {
			return new Promise((resolve, reject) => {
				value ? resolve() : reject('描述不能为空')
			})
		}
	}
}

function handleGoPrev() {
	setActive(1)
}

async function handleGoNext() {

	const validator = new Schema(descriptor)

	try {
		// await validator.validate({
		// 	spcmd: formData.spcmd,
		// 	description: formData.description
		// })
		commitStageUtilInfo(formData)
		setFinished(2)
		setActive(3)

	} catch ({ errors, fields }: any) {
		handleErrors(errors, fields)
	}
}

function handleErrors(errors: ValidateError[], fields: Values) {
	if ('spcmd' in fields) {
		validateErrors.spcmd = fields.spcmd[0].message;
		hasError.spcmd = true
		// console.log(validateErrors.spcmd);

	}

	if ('description' in fields) {
		validateErrors.description = fields.description[0].message
		hasError.description = true
		// console.log(validateErrors.description)
	}

	resetTimer = setTimeout(() => resetErrors(), 2000)
}

function resetErrors() {
	validateErrors.spcmd = ''
	validateErrors.description = ''
	hasError.spcmd = false
	hasError.description = false
}

onUnmounted(() => {
	clearTimeout(resetTimer)
})
</script>