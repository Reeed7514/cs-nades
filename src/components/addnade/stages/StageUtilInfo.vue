<template>
	<div class="w-2/5 p-6 border border-slate-200 rounded-md">
		<p class="text-xl font-medium w-full border-b border-slate-100 pb-4">道具信息</p>
		<!-- info -->

		<div class="mt-2 mb-4">
			<p class="mb-1">地图</p>

			<select class="outline-none border border-slate-200 rounded-md py-1" v-model="formData.map">
				<option selected>荒漠迷城</option>
				<option>炼狱小镇</option>
				<option>死亡游乐园</option>
				<option>远古遗迹</option>
				<option>核子危机</option>
				<option>殒命大厦</option>
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
				<option>左右键组合</option>
			</select>
		</div>

		<div class="mt-2 mb-4">
			<p class="mb-1">传送位置指令</p>

			<input type="text" v-model="formData.spcmd" class="p-1 border border-slate-200 rounded-md outline-none">
		</div>


		<!-- 描述 -->
		<div class="border-t border-slate-200">
			<div class="mt-2 mb-4">
				<p class="mb-1">描述</p>

				<textarea v-model="formData.description"
					class="w-full outline-none border border-slate-200 rounded-md p-1 h-32"></textarea>
			</div>
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
import { Cloud, Fire, Bomb } from '@vicons/fa'
import { Flash } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils'
import { useProgressStore } from '@/stores/progress'
import { ref, reactive } from 'vue'
import Schema from 'async-validator'
import type { Rules, ValidateError, Values } from 'async-validator'

const { setActive, setFinished } = useProgressStore()

const validating = ref(false)

const formData = reactive<Record<string, string>>({
	map: '荒漠迷城',
	nadeType: 'smoke',
	team: 't',
	movement: '静止',
	throwType: '左键',
	spcmd: '',
	description: ''
})

const validateErrors = reactive<Record<string, string>>({
	spcmd: '',
	description: ''
})

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
	validating.value = true

	const validator = new Schema(descriptor)

	try {
		await validator.validate({
			spcmd: formData.spcmd,
			description: formData.description
		})

		validating.value = false
		setFinished(2)
		setActive(3)

	} catch ({ errors, fields }: any) {
		handleErrors(errors, fields)
	}
}

function handleErrors(errors: ValidateError[], fields: Values) {
	if ('spcmd' in fields) {
		validateErrors.spcmd = fields.spcmd[0].message;

		// console.log(validateErrors.spcmd);

	}

	if ('description' in fields) {
		validateErrors.description = fields.description[0].message

		// console.log(validateErrors.description)

	}

	validating.value = false
}
</script>