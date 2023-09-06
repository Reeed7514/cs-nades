<template>
  <div class="w-4/5 p-6 border border-slate-200 rounded-md">
    <p class="text-xl font-medium w-full border-b border-slate-100 pb-4">上传视频</p>

    <div class="flex gap-4">
      <div class="flex flex-col gap-4">
        <p class="mt-2">视频链接</p>
        <input type="text" v-model="url" @input="resolveUrl"
          class="border border-slate-200 w-96 h-10 outline-none px-2 rounded-md">
      </div>


      <div class="mt-12 bg-blue-200 rounded-md p-2">
        <p>Use caution when making use of Experimental features, particularly within modules. Users may not be aware that
          experimental features are being used. Bugs or behavior changes may surprise users when Experimental API
          modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag.
          Experimental features may also emit a warning.</p>
      </div>


    </div>

    <div class="mx-auto w-max mt-4">
      <button @click="setActive(2)" :disabled="!getFinished(1)"
        class="border border-slate-200 rounded-md px-2 w-20 h-10 hover:bg-blue-200">下一个</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgressStore } from '@/stores/progress';
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';

const url = ref('')
const resolveSuccess = ref(false)
const progressStore = useProgressStore()
const { setFinished, setActive } = progressStore
const { getFinished } = storeToRefs(progressStore)

function resolveUrl() {

  if (url.value !== '') {
    // resolve logic
    setFinished(1)
    resolveSuccess.value = true
  }
}

</script>