import { defineStore } from 'pinia'

interface AppState {
  bottomNavIndex: number
  isLoading: boolean
  networkStatus: 'online' | 'offline'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    bottomNavIndex: 0,
    isLoading: false,
    networkStatus: navigator.onLine ? 'online' : 'offline'
  }),

  actions: {
    setBottomNavIndex(index: number) {
      this.bottomNavIndex = index
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    updateNetworkStatus() {
      this.networkStatus = navigator.onLine ? 'online' : 'offline'
    }
  }
})
