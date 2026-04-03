import { defineStore } from 'pinia'
import type { Notification } from '@types'

interface NotificationState {
  unreadCount: number
  notifications: Notification[]
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    unreadCount: 0,
    notifications: []
  }),

  getters: {
    hasUnread: (state) => state.unreadCount > 0
  },

  actions: {
    setNotifications(notifications: Notification[]) {
      this.notifications = notifications
      this.unreadCount = notifications.filter(n => !n.isRead).length
    },

    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification && !notification.isRead) {
        notification.isRead = true
        this.unreadCount--
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.isRead = true)
      this.unreadCount = 0
    },

    addNotification(notification: Notification) {
      this.notifications.unshift(notification)
      if (!notification.isRead) {
        this.unreadCount++
      }
    }
  }
})
