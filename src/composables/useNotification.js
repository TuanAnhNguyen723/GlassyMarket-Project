import { ref } from 'vue'

const notifications = ref([])

let notificationIdCounter = 0

/**
 * Composable để quản lý notifications toàn cục
 * @returns {Object} { notifications, showNotification, removeNotification }
 */
export function useNotification() {
  /**
   * Hiển thị một notification
   * @param {Object} options - Cấu hình notification
   * @param {string} options.message - Nội dung thông báo
   * @param {string} options.type - Loại: 'success', 'error', 'info', 'warning' (mặc định: 'success')
   * @param {number} options.duration - Thời gian tự động ẩn (ms), mặc định 3000ms. 0 = không tự ẩn
   * @param {string} options.icon - Icon material symbols (tùy chọn)
   */
  const showNotification = (options) => {
    const id = ++notificationIdCounter
    const notification = {
      id,
      message: options.message || 'Thông báo',
      type: options.type || 'success',
      duration: options.duration ?? 3000,
      icon: options.icon || null,
    }

    notifications.value.push(notification)

    // Tự động xóa sau duration (nếu > 0)
    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  /**
   * Xóa notification theo ID
   * @param {number} id - ID của notification
   */
  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Xóa tất cả notifications
   */
  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAll,
  }
}
