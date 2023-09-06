<template>
  <div class="flex relative place-content-around w-full">
    <div class="absolute top-3 left-0 w-full -z-10 h-2 bg-gray-200"></div>
    <StageInfo :active="activeStageNumber === 1" :finished="getFinished(1)" :stage-number="1"
      stage-name="上传视频" />
    <StageInfo :active="activeStageNumber === 2" :finished="getFinished(2)" :stage-number="2"
      stage-name="道具信息" />
    <StageInfo :active="activeStageNumber === 3" :finished="getFinished(3)" :stage-number="3"
      stage-name="位置" />
    <StageInfo :active="activeStageNumber === 4" :finished="getFinished(4)" :stage-number="4"
      stage-name="效果图" />
    <StageInfo :active="activeStageNumber === 5" :finished="getFinished(5)" :stage-number="5"
      stage-name="瞄点图" />


  </div>
</template>

<script setup lang="ts">
import StageInfo from './StageInfo.vue'

import { useProgressStore } from '../../stores/progress'
import { storeToRefs } from 'pinia';



const progressStore = useProgressStore()
const { setActive } = progressStore
const { activeStageNumber, allDone, getFinished } = storeToRefs(progressStore)




</script>