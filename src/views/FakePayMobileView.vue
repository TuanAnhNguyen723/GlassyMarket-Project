<template>
  <main class="min-h-[70vh] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
      <h1 class="text-lg font-bold text-zinc-900 dark:text-white">
        Xác nhận thanh toán QR
      </h1>

      <p class="text-sm text-zinc-500 dark:text-zinc-400">
        Mã phiên: <span class="font-semibold text-zinc-700 dark:text-zinc-200">{{ sessionId }}</span>
      </p>

      <div class="rounded-xl border px-3 py-2 text-sm" :class="statusClass">
        {{ statusText }}
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </p>

      <button
        type="button"
        class="w-full h-11 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold disabled:opacity-60"
        :disabled="loadingConfirm || !confirmToken || status === 'paid' || status === 'expired' || status === 'cancelled'"
        @click="handleConfirm"
      >
        {{ loadingConfirm ? "Đang xác nhận..." : "Xác nhận thanh toán" }}
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AUTH_TOKEN_KEY } from "@/services/api.js";
import { useNotification } from "@/composables/useNotification.js";
import fakePaymentService from "@/services/fakePaymentService.js";

const route = useRoute();
const router = useRouter();
const { showNotification } = useNotification();
const sessionId = String(route.params.sessionId || "");

const status = ref("pending");
const confirmToken = ref("");
const loadingConfirm = ref(false);
const errorMessage = ref("");

const statusText = computed(() => {
  if (status.value === "paid") return "Thanh toán thành công";
  if (status.value === "scanned") return "Đã quét, chờ xác nhận";
  if (status.value === "expired") return "Mã đã hết hạn";
  if (status.value === "cancelled") return "Phiên đã hủy";
  return "Chờ quét";
});

const statusClass = computed(() => {
  if (status.value === "paid") return "border-emerald-300 text-emerald-700 bg-emerald-50";
  if (status.value === "scanned") return "border-sky-300 text-sky-700 bg-sky-50";
  if (status.value === "expired" || status.value === "cancelled") return "border-red-300 text-red-700 bg-red-50";
  return "border-zinc-300 text-zinc-700 bg-zinc-50";
});

function redirectToLogin() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("user");
  router.replace({ name: "Login", query: { redirect: route.fullPath } });
}

async function handleScan() {
  errorMessage.value = "";
  try {
    const res = await fakePaymentService.scanSession(sessionId);
    status.value = String(res.status || "scanned");
    confirmToken.value = String(res.confirm_token || "");
  } catch (err) {
    if (Number(err?.status) === 401) {
      redirectToLogin();
      return;
    }
    if (Number(err?.status) === 422) {
      status.value = "expired";
      errorMessage.value = "Mã đã hết hạn, quay lại desktop để tạo mã mới.";
      return;
    }
    errorMessage.value = err?.message || "Không thể quét phiên thanh toán.";
  }
}

async function handleConfirm() {
  if (!confirmToken.value || loadingConfirm.value) return;
  loadingConfirm.value = true;
  errorMessage.value = "";
  try {
    const res = await fakePaymentService.confirmSession(sessionId, confirmToken.value);
    status.value = String(res.status || "paid");
    if (status.value === "paid") {
      showNotification({ message: "Thanh toán thành công.", type: "success", duration: 2500 });
    }
  } catch (err) {
    if (Number(err?.status) === 401) {
      redirectToLogin();
      return;
    }
    if (Number(err?.status) === 422) {
      status.value = "expired";
      errorMessage.value = "Mã đã hết hạn, quay lại desktop để tạo mã mới.";
      return;
    }
    if (Number(err?.status) === 403) {
      errorMessage.value = "Token xác nhận không hợp lệ hoặc hết hạn. Vui lòng quét lại QR.";
      confirmToken.value = "";
      return;
    }
    errorMessage.value = err?.message || "Không thể xác nhận thanh toán.";
  } finally {
    loadingConfirm.value = false;
  }
}

onMounted(() => {
  if (!sessionId) {
    errorMessage.value = "Thiếu sessionId.";
    return;
  }
  handleScan();
});
</script>
