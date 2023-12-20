<template>
  <div class="mt-16 flex justify-center pt-4">
    <MapSelector @mapchange="handleMapChange" />
    <MapBoard :map="currentMap" :nadeType="nadeType"/>
  </div>
</template>

<script setup lang="ts">
import MapSelector from "../components/map/MapSelector.vue"
import MapBoard from '../components/map/MapBoard.vue'
import {ref} from 'vue'

const currentMap = ref('mirage')
const nadeType = ref('smoke')

function handleMapChange(map:string){
  currentMap.value = map
}
</script>

<style scoped></style>
