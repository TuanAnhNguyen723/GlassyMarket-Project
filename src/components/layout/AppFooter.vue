<template>
  <footer
    class="bg-zinc-50 dark:bg-zinc-900/50 border-t border-[#e9f1f1] dark:border-zinc-800 py-20"
  >
    <div
      class="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-12"
    >
      <div class="col-span-1">
        <div class="flex items-center gap-2.5 mb-5">
          <img
            v-if="resolvedSiteLogoUrl"
            :src="resolvedSiteLogoUrl"
            :alt="storeName"
            class="size-8 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div
            v-else
            class="size-8 bg-primary rounded-lg flex items-center justify-center text-white"
          >
            <span class="material-symbols-outlined text-base">visibility</span>
          </div>
          <h2 class="text-lg font-black tracking-tight uppercase leading-none">
            {{ storeName }}
          </h2>
        </div>
        <p class="text-sm text-zinc-500 leading-7 max-w-xs">
          {{ $t("footer.description") }}
        </p>
      </div>

      <div>
        <h4 class="font-bold mb-5">{{ $t("footer.support") }}</h4>
        <ul class="space-y-3.5 text-sm text-zinc-500 leading-6">
          <li>
            <RouterLink
              class="hover:text-primary transition-colors"
              to="/about"
              >{{ $t("footer.helpCenter") }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="hover:text-primary transition-colors"
              to="/about"
              >{{ $t("footer.orderStatus") }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="hover:text-primary transition-colors"
              to="/about"
              >{{ $t("footer.shippingReturns") }}</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="hover:text-primary transition-colors"
              to="/contact"
              >{{ $t("footer.contactUs") }}</RouterLink
            >
          </li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-5">Mạng xã hội</h4>
        <ul class="space-y-3 text-sm text-zinc-500">
          <li>
            <a
              v-if="facebookUrl"
              :href="facebookUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-base">thumb_up</span>
              <span>Facebook</span>
            </a>
            <span v-else class="inline-flex items-center gap-2 opacity-60">
              <span class="material-symbols-outlined text-base">thumb_up</span>
              <span>Facebook</span>
            </span>
          </li>
          <li>
            <a
              v-if="zaloUrl"
              :href="zaloUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-base">chat</span>
              <span>Zalo</span>
            </a>
            <span v-else class="inline-flex items-center gap-2 opacity-60">
              <span class="material-symbols-outlined text-base">chat</span>
              <span>Zalo</span>
            </span>
          </li>
          <li>
            <a
              v-if="youtubeUrl"
              :href="youtubeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-base">play_circle</span>
              <span>YouTube</span>
            </a>
            <span v-else class="inline-flex items-center gap-2 opacity-60">
              <span class="material-symbols-outlined text-base">play_circle</span>
              <span>YouTube</span>
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-5">{{ $t("footer.contactUs") }}</h4>
        <ul class="space-y-3.5 text-sm text-zinc-500 leading-6">
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-outlined text-base mt-0.5">call</span>
            <a
              v-if="contactPhone"
              class="hover:text-primary transition-colors break-all"
              :href="`tel:${contactPhone}`"
            >
              {{ contactPhone }}
            </a>
            <span v-else>—</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-outlined text-base mt-0.5">mail</span>
            <a
              v-if="contactEmail"
              class="hover:text-primary transition-colors break-all"
              :href="`mailto:${contactEmail}`"
            >
              {{ contactEmail }}
            </a>
            <span v-else>—</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-outlined text-base mt-0.5">location_on</span>
            <span>{{ storeAddress || "—" }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="max-w-[1440px] mx-auto px-6 lg:px-20 mt-20 pt-8 border-t border-[#e9f1f1] dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p class="text-xs text-zinc-400">
        {{ displayCopyright }}
      </p>
      <div class="flex gap-6 grayscale opacity-50">
        <span class="material-symbols-outlined">payments</span>
        <span class="material-symbols-outlined">credit_card</span>
        <span class="material-symbols-outlined">account_balance_wallet</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useGeneralSettings } from "@/composables/useGeneralSettings";
import { resolveAssetUrl } from "@/services/api";

const year = computed(() => new Date().getFullYear());
const {
  storeName,
  siteLogoUrl,
  contactPhone,
  contactEmail,
  storeAddress,
  facebookUrl,
  zaloUrl,
  youtubeUrl,
  copyrightText,
} = useGeneralSettings();
const resolvedSiteLogoUrl = computed(() => resolveAssetUrl(siteLogoUrl.value));
const displayCopyright = computed(() => {
  if (copyrightText.value) return copyrightText.value;
  return `© ${year.value} ${storeName.value}. All rights reserved.`;
});
</script>
