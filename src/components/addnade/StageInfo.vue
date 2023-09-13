<template>
  <div class="flex flex-col items-center ">
    <div
    :class="props.active ? 'bg-blue-300' : props.finished ? 'bg-green-300' : 'bg-gray-200'"
      class="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer">
      <Icon v-if="!props.active && props.finished" :size="24" color="#fff">
        <Checkmark12Filled />
      </Icon>
      <span v-else class="text-white">{{ props.stageNumber }}</span>
    </div>
    <p class="text-sm">{{ props.stageName }}</p>
  </div>
</template>

<script setup lang="ts">
import { Checkmark12Filled } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import { useProgressStore } from '@/stores/progress';

interface Props {
  active: boolean,
  finished: boolean,
  stageName: string,
  stageNumber: number
}
const props = defineProps<Props>()

// const {setActive} = useProgressStore()

// function handleClick(){
//   if(props.finished){
//     setActive(props.stageNumber)
//   }
// }
</script>