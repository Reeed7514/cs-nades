<template>
  <div class="mt-16 flex items-center flex-col">
    <div class="my-4 w-full">
      <ProgressLine />
    </div>

    <KeepAlive>
      <component :is="activeStage"></component>
    </KeepAlive>


  </div>
</template>

<script setup lang="ts">
import StageUtilInfo from '../components/addnade/stages/StageUtilInfo.vue'
import StageVideo from '../components/addnade/stages/StageVideo.vue'
import StageLocations from '../components/addnade/stages/StageLocations.vue'
import ProgressLine from '../components/addnade/ProgressLine.vue'
import { useProgressStore } from '../stores/progress'
import { storeToRefs } from 'pinia';


import { computed } from 'vue'

const { activeStageNumber } = storeToRefs(useProgressStore())

const stages = [StageVideo, StageUtilInfo, StageLocations]

const activeStage = computed(() => stages[activeStageNumber.value - 1])
</script>