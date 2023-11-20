import { defineStore } from "pinia"
import axiosClient from "@/axios"

interface UtilInfo {
  [key: string]: string
}

interface Locations {
  [key: string]: string
}

interface Images {
  [key: string]: Blob
}

export const useProgressStore = defineStore("progress", {
  state: () => {
    return {
      activeStageNumber: 1,
      finishedMap: Object.fromEntries([1, 2, 3, 4, 5].map((n) => [n, false])),
      video: null as Blob | null,
      utilInfo: null as UtilInfo | null,
      locations: null as Locations | null,
      images: null as Images | null,
    }
  },
  getters: {
    getFinished: (state) => {
      return (stage: number) => {
        return state.finishedMap[stage]
      }
    },
    allDone: (state) => {
      return !Array.from(Object.values(state.finishedMap)).some(
        (value) => !value
      )
    },
  },
  actions: {
    setActive(stage: number) {
      this.activeStageNumber = stage
    },
    setFinished(stage: number) {
      this.finishedMap[stage] = true
    },
    commitStageVideo(data: any) {
      this.video = data
    },
    commitStageUtilInfo(data: any) {
      this.utilInfo = data
    },
    commitStageLocations(data: any) {
      this.locations = data
    },
    commitStagePic(data: any) {
      this.images = data
    },
    async submitNade() {
      const formData = new FormData()

      formData.append("video", this.video as Blob)
      for (const key in this.utilInfo) {
        formData.append(key, this.utilInfo[key])
      }

      for (const key in this.locations) {
        formData.append(key, this.locations[key])
      }

      for (const key in this.images) {
        formData.append(key, this.images[key])
      }

			formData.append('map', 'cbble')

      // for (const entry of formData.entries()) {
      //   console.log(entry)
      // }

			try {
				const result = await axiosClient.post("/nade/create", formData)
				console.log(result.data)
				
			} catch (error) {
				console.log(error)
			}
    },
  },
})
