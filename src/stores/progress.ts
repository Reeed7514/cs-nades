import {defineStore} from 'pinia'

export const useProgressStore = defineStore('progress', {
  state: () => {
    return {
      activeStageNumber: 1,
      finishedMap: Object.fromEntries([1,2,3,4,5].map(n => [n, false]))
    }
  },
  getters: {
    getFinished: (state) => {
      return (stage: number) => {
        return state.finishedMap[stage]
      }
    },
    allDone: (state) => {
      return ! Array.from(Object.values(state.finishedMap)).some(value => !value)
    }
  },
  actions: {
    setActive(stage: number){
      this.activeStageNumber = stage
    },
    setFinished(stage: number){
      this.finishedMap[stage] = true
    }
  }
})