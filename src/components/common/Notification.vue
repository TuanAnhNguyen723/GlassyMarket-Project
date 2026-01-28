<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        name="notification"
        tag="div"
        class="flex flex-col gap-3"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 px-4 py-3 min-w-[300px] max-w-[400px] animate-slide-in-right"
          :class="getNotificationClasses(notification.type)"
        >
          <!-- Icon -->
          <div
            v-if="notification.icon || getDefaultIcon(notification.type)"
            class="flex-shrink-0"
          >
            <span
              class="material-symbols-outlined text-xl"
              :class="getIconClasses(notification.type)"
            >
              {{ notification.icon || getDefaultIcon(notification.type) }}
            </span>
          </div>

          <!-- Message -->
          <p class="flex-1 text-sm font-medium text-slate-900 dark:text-white">
            {{ notification.message }}
          </p>

          <!-- Close Button -->
          <button
            class="flex-shrink-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            type="button"
            @click="removeNotification(notification.id)"
            aria-label="Đóng thông báo"
          >
            <span
              class="material-symbols-outlined text-base text-slate-500 dark:text-slate-400"
            >
              close
            </span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotification } from "@/composables/useNotification";

const { notifications, removeNotification } = useNotification();

const getNotificationClasses = (type) => {
  const classes = {
    success: "border-l-4 border-l-green-500",
    error: "border-l-4 border-l-red-500",
    warning: "border-l-4 border-l-amber-500",
    info: "border-l-4 border-l-blue-500",
  };
  return classes[type] || classes.success;
};

const getIconClasses = (type) => {
  const classes = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  };
  return classes[type] || classes.success;
};

const getDefaultIcon = (type) => {
  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
  };
  return icons[type] || icons.success;
};
</script>

<style scoped>
/* Animation slide in từ phải */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

/* Transition group animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
