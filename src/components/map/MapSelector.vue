<template>
  <div class="flex flex-col border border-slate-300 rounded-md w-[150px]">
    <div class="px-4 py-2 text-center bg-orange-300">
      地图
    </div>

    <div v-for="map in maps" class="flex gap-3 items-center px-4 py-2 border-t border-t-slate-200 hover:bg-gray-200 hover:cursor-pointer">
      <img :src="'/mapicons/' + map + '.webp'" class="w-6 h-auto">
      <p>{{ map }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
const maps = [
  "mirage",
  "inferno",
  "overpass",
  "ancient",
  "nuke",
  "vertigo",
  "anubis",
]
</script>

<style scoped></style>
