<template>
  <main
    class="relative flex-1 max-w-[1280px] mx-auto w-full px-5 sm:px-8 lg:px-14 py-8 lg:py-10"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl"
    />
    <Breadcrumbs
      :items="[
        { label: $t('products.home'), to: '/' },
        { label: $t('checkout.breadcrumbCart'), to: '/cart' },
        { label: $t('checkout.breadcrumbCheckout') },
      ]"
      class-name="mb-8"
      link-class="text-[#5e8487] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
      current-class="text-sm font-semibold text-[#111718] dark:text-white"
      separator-class="text-[#5e8487] dark:text-gray-600 text-sm"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- Left: Checkout steps -->
      <div class="lg:col-span-7 space-y-6">
        <div class="mb-6">
          <h1
            class="text-3xl lg:text-4xl font-black tracking-tight mb-1 text-zinc-900 dark:text-zinc-100"
          >
            {{ $t("checkout.title") }}
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm">
            {{ $t("checkout.subtitle") }}
          </p>
        </div>

        <!-- Step 1: Shipping -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-visible bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 1 ? null : 1"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                1
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t("checkout.step1") }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 1 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 1" class="p-6 space-y-4">
            <label class="block">
              <span
                class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                >{{ $t("checkout.shippingName") }}</span
              >
              <input
                v-model="shipping.name"
                class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                type="text"
              />
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="block">
                <span
                  class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                  >{{ $t("checkout.shippingPhone") }}</span
                >
                <input
                  v-model="shipping.phone"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="tel"
                />
              </label>
              <label class="block">
                <span
                  class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                  >{{ $t("checkout.shippingEmail") }}</span
                >
                <input
                  v-model="shipping.email"
                  class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                  type="email"
                />
              </label>
            </div>
            <label class="block">
              <span
                class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                >{{ $t("checkout.shippingAddress") }}</span
              >
              <input
                v-model="shipping.address"
                class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 px-4 text-sm"
                type="text"
              />
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="block">
                <span
                  class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                  >Tỉnh / Thành</span
                >
                <div class="relative">
                  <input
                    v-model="provinceQuery"
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    role="combobox"
                    :aria-expanded="provinceOpen"
                    class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 pl-4 pr-11 text-sm"
                    :placeholder="
                      loadingProvinces
                        ? 'Đang tải Tỉnh / Thành...'
                        : 'Gõ để tìm hoặc chọn Tỉnh / Thành'
                    "
                    :disabled="loadingProvinces"
                    @focus="onProvinceFocus"
                    @blur="onProvinceBlur"
                    @input="onProvinceInput"
                    @keydown.escape.prevent="closeProvinceDropdown"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    tabindex="-1"
                    aria-label="Mở danh sách tỉnh thành"
                    :disabled="loadingProvinces"
                    @mousedown.prevent="toggleProvinceDropdown"
                  >
                    <span
                      class="material-symbols-outlined text-xl transition-transform"
                      :class="provinceOpen ? 'rotate-180' : ''"
                    >
                      expand_more
                    </span>
                  </button>
                  <ul
                    v-show="
                      provinceOpen &&
                      !loadingProvinces &&
                      filteredProvinceOptions.length
                    "
                    class="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg"
                    role="listbox"
                  >
                    <li
                      v-for="province in filteredProvinceOptions"
                      :key="province.code"
                      role="option"
                      class="px-4 py-2.5 text-sm cursor-pointer text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      @mousedown.prevent="selectProvince(province)"
                    >
                      {{ province.name }}
                    </li>
                  </ul>
                  <div
                    v-show="
                      provinceOpen &&
                      !loadingProvinces &&
                      !filteredProvinceOptions.length &&
                      provinceQuery.trim()
                    "
                    class="absolute z-30 mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 shadow-lg"
                  >
                    Không tìm thấy Tỉnh / Thành phù hợp.
                  </div>
                </div>
              </label>
              <label class="block">
                <span
                  class="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 block"
                  >Xã / Phường</span
                >
                <div class="relative">
                  <input
                    v-model="wardQuery"
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    role="combobox"
                    :aria-expanded="wardOpen"
                    class="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent h-11 pl-4 pr-11 text-sm disabled:opacity-60"
                    :placeholder="
                      !shipping.state
                        ? 'Chọn Tỉnh / Thành trước'
                        : loadingWards
                          ? 'Đang tải Xã / Phường...'
                          : 'Gõ để tìm (xã, phường, huyện)...'
                    "
                    :disabled="!shipping.state || loadingWards"
                    @focus="onWardFocus"
                    @blur="onWardBlur"
                    @input="onWardInput"
                    @keydown.escape.prevent="closeWardDropdown"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-40"
                    tabindex="-1"
                    aria-label="Mở danh sách xã phường"
                    :disabled="!shipping.state || loadingWards"
                    @mousedown.prevent="toggleWardDropdown"
                  >
                    <span
                      class="material-symbols-outlined text-xl transition-transform"
                      :class="wardOpen ? 'rotate-180' : ''"
                    >
                      expand_more
                    </span>
                  </button>
                  <ul
                    v-show="
                      wardOpen &&
                      shipping.state &&
                      !loadingWards &&
                      filteredWardOptions.length
                    "
                    class="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg"
                    role="listbox"
                  >
                    <li
                      v-for="ward in filteredWardOptions"
                      :key="ward.key"
                      role="option"
                      class="px-4 py-2.5 text-sm cursor-pointer text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      @mousedown.prevent="selectWard(ward)"
                    >
                      {{ ward.label }}
                    </li>
                  </ul>
                  <div
                    v-show="
                      wardOpen &&
                      shipping.state &&
                      !loadingWards &&
                      !filteredWardOptions.length &&
                      wardQuery.trim()
                    "
                    class="absolute z-30 mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 shadow-lg"
                  >
                    Không tìm thấy Xã / Phường phù hợp.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </section>

        <!-- Step 2: Delivery -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 2 ? null : 2"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                2
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t("checkout.step2") }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 2 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 2" class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  deliveryMethod === 'standard'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="deliveryMethod"
                  class="sr-only"
                  type="radio"
                  value="standard"
                />
                <span class="flex-1">
                  <span
                    class="block text-sm font-bold text-zinc-900 dark:text-white"
                    >{{ $t("checkout.deliveryStandard") }}</span
                  >
                  <span
                    class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400"
                    >{{ $t("checkout.deliveryStandardDays") }}</span
                  >
                  <span
                    class="mt-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100"
                    >{{ $t("cart.free") }}</span
                  >
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="
                    deliveryMethod === 'standard'
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-slate-300 dark:text-gray-600'
                  "
                >
                  {{
                    deliveryMethod === "standard" ? "check_circle" : "circle"
                  }}
                </span>
              </label>
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  deliveryMethod === 'express'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="deliveryMethod"
                  class="sr-only"
                  type="radio"
                  value="express"
                />
                <span class="flex-1">
                  <span
                    class="block text-sm font-bold text-zinc-900 dark:text-white"
                    >{{ $t("checkout.deliveryExpress") }}</span
                  >
                  <span
                    class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400"
                    >{{ $t("checkout.deliveryExpressDays") }}</span
                  >
                  <span
                    class="mt-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100"
                    >{{ formatPrice(expressShippingFee) }}</span
                  >
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="
                    deliveryMethod === 'express'
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-slate-300 dark:text-gray-600'
                  "
                >
                  {{ deliveryMethod === "express" ? "check_circle" : "circle" }}
                </span>
              </label>
            </div>
          </div>
        </section>

        <!-- Step 3: Chọn phương thức thanh toán (trước khi tạo đơn) -->
        <section
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/80"
        >
          <button
            type="button"
            class="w-full p-5 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
            @click="stepOpen = stepOpen === 3 ? null : 3"
          >
            <div class="flex items-center gap-3">
              <span
                class="size-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm"
              >
                3
              </span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-white">
                {{ $t("checkout.step3") }}
              </h2>
            </div>
            <span
              class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 transition-transform"
              :class="stepOpen === 3 ? 'rotate-180' : ''"
            >
              expand_more
            </span>
          </button>
          <div v-show="stepOpen === 3" class="p-6 space-y-4">
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              {{ $t("checkout.selectPaymentMethod") }}
            </p>
            <div class="space-y-3">
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  paymentMethod === 'bank_transfer'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="paymentMethod"
                  class="sr-only"
                  type="radio"
                  value="bank_transfer"
                />
                <span
                  class="flex-1 font-semibold text-sm text-zinc-900 dark:text-white"
                >
                  Thanh toán QR
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="
                    paymentMethod === 'bank_transfer'
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-slate-300 dark:text-gray-600'
                  "
                >
                  {{
                    paymentMethod === "bank_transfer"
                      ? "check_circle"
                      : "circle"
                  }}
                </span>
              </label>
              <label
                class="relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="
                  paymentMethod === 'direct'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                "
              >
                <input
                  v-model="paymentMethod"
                  class="sr-only"
                  type="radio"
                  value="direct"
                />
                <span
                  class="flex-1 font-semibold text-sm text-zinc-900 dark:text-white"
                >
                  {{ $t("checkout.payDirect") }}
                </span>
                <span
                  class="material-symbols-outlined flex-shrink-0"
                  :class="
                    paymentMethod === 'direct'
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-slate-300 dark:text-gray-600'
                  "
                >
                  {{ paymentMethod === "direct" ? "check_circle" : "circle" }}
                </span>
              </label>
            </div>
          </div>
        </section>

        <section
          v-if="paymentMethod === 'bank_transfer'"
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/80 p-6 space-y-4"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-bold text-zinc-900 dark:text-white">
              Thanh toán QR
            </h3>
            <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {{ fakePaymentStatusText }}
            </span>
          </div>

          <p v-if="fakePaymentSession?.payment_code" class="text-sm text-zinc-600 dark:text-zinc-300">
            Mã thanh toán: <span class="font-bold">{{ fakePaymentSession.payment_code }}</span>
          </p>

          <button
            v-if="!fakePaymentSession?.session_id || !fakeQrDataUrl"
            type="button"
            class="w-full h-11 rounded-xl border border-zinc-300 dark:border-zinc-600 font-semibold text-sm text-zinc-900 dark:text-zinc-100"
            :disabled="isStartingFakePayment"
            @click="startFakePaymentSession"
          >
            {{ isStartingFakePayment ? "Đang tạo mã..." : "Tạo mã QR" }}
          </button>

          <div v-if="fakeQrDataUrl" class="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col items-center gap-3">
            <img :src="fakeQrDataUrl" alt="QR thanh toán" class="w-52 h-52 rounded-xl" />
            <p class="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              Dùng điện thoại quét QR để mở trang xác nhận thanh toán.
            </p>
          </div>

          <p v-if="fakePaymentSession?.expires_at" class="text-sm text-zinc-600 dark:text-zinc-300">
            Thời gian còn lại: <span class="font-semibold">{{ fakeCountdownText }}</span>
          </p>

          <p v-if="fakePaymentError" class="text-sm text-red-600 dark:text-red-400">
            {{ fakePaymentError }}
          </p>

          <button
            v-if="shouldShowRegenerateFakeQr"
            type="button"
            class="w-full h-11 rounded-xl border border-zinc-300 dark:border-zinc-600 font-semibold text-sm text-zinc-900 dark:text-zinc-100"
            :disabled="isStartingFakePayment"
            @click="startFakePaymentSession"
          >
            {{ isStartingFakePayment ? "Đang tạo mã..." : "Tạo mã mới" }}
          </button>
        </section>

        <!-- Thanh toán (tạo đơn kèm payment_method → backend set paid/pending) -->
        <button
          type="button"
          class="w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-zinc-900 font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isPlacingOrder || isStartingFakePayment || !canPlaceOrder || !canSubmitOrder"
          @click="handleCheckoutAction"
        >
          <span v-if="isPlacingOrder || isStartingFakePayment" class="animate-pulse">...</span>
          <span v-else class="material-symbols-outlined">verified_user</span>
          {{ checkoutButtonText }}
        </button>
      </div>

      <!-- Right: Order Summary -->
      <aside class="lg:col-span-5 lg:sticky lg:top-24">
        <div
          class="border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/80 p-6 space-y-6 shadow-[0_24px_45px_-38px_rgba(0,0,0,0.8)]"
        >
          <h2
            class="text-xl font-black tracking-tight text-zinc-900 dark:text-white"
          >
            {{ $t("cart.orderSummary") }}
          </h2>

          <div
            v-if="!cartItems.length"
            class="py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm"
          >
            {{ $t("cart.emptyMessage") }}
          </div>
          <template v-else>
            <div class="space-y-4 max-h-[280px] overflow-y-auto pr-1">
              <div v-for="item in cartItems" :key="item.id" class="flex gap-3">
                <div
                  class="size-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 bg-cover bg-center"
                  :style="{
                    backgroundImage: item.image ? `url('${item.image}')` : '',
                  }"
                />
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2"
                  >
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    x{{ item.quantity }}
                  </p>
                  <p
                    class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1"
                  >
                    {{ formatPrice(parsePrice(item.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div v-if="user?.id" class="mb-4">
                <div
                  class="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/40 p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <p
                      class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                      Voucher của tôi
                    </p>
                    <span
                      class="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400"
                    >
                      {{ myVouchers.length }} mã
                    </span>
                  </div>
                  <div
                    v-if="loadingMyVouchers"
                    class="text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    {{ $t("common.loading") }}
                  </div>
                  <div
                    v-else-if="myVouchers.length"
                    class="flex flex-wrap gap-2"
                  >
                    <button
                      v-for="voucher in myVouchers"
                      :key="`my-${voucher.id || voucher.code}`"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
                      :class="
                        appliedPromoCode === voucher.code
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      "
                      @click="selectVoucher(voucher)"
                    >
                      {{ voucher.code }}
                    </button>
                  </div>
                  <p
                    v-else
                    class="text-[11px] text-zinc-500 dark:text-zinc-400"
                  >
                    Bạn chưa lưu voucher nào.
                  </p>
                </div>
              </div>

              <div v-if="user?.id" class="mb-4">
                <div
                  class="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3"
                >
                  <p
                    class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2"
                  >
                    Kho voucher
                  </p>
                  <div
                    v-if="loadingAvailableVouchers"
                    class="text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    {{ $t("common.loading") }}
                  </div>
                  <div
                    v-else-if="availableVouchers.length"
                    class="space-y-2 max-h-56 overflow-auto pr-1"
                  >
                    <div
                      v-for="voucher in availableVouchers"
                      :key="`available-${voucher.id || voucher.code}`"
                      class="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2"
                    >
                      <div class="min-w-0 pr-2">
                        <p
                          class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate"
                        >
                          {{ voucher.code }}
                        </p>
                        <p
                          class="text-[11px] text-zinc-500 dark:text-zinc-400 truncate"
                        >
                          {{ voucher.description || voucher.name }}
                        </p>
                      </div>
                      <button
                        type="button"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60"
                        :class="
                          isVoucherClaimed(voucher)
                            ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300'
                            : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        "
                        :disabled="
                          claimingVoucherId === voucher.id ||
                          isVoucherClaimed(voucher)
                        "
                        @click="claimVoucher(voucher)"
                      >
                        {{
                          isVoucherClaimed(voucher)
                            ? "Đã lưu"
                            : claimingVoucherId === voucher.id
                              ? $t("common.loading")
                              : "Lưu"
                        }}
                      </button>
                    </div>
                  </div>
                  <p
                    v-else
                    class="text-[11px] text-zinc-500 dark:text-zinc-400"
                  >
                    Hiện chưa có voucher khả dụng.
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  class="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm h-10 px-3 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
                  :placeholder="$t('checkout.promoCode')"
                  type="text"
                />
                <button
                  type="button"
                  :disabled="isApplyingPromo"
                  class="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 rounded-xl text-sm font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors"
                  @click="applyPromoCode()"
                >
                  {{
                    isApplyingPromo
                      ? $t("common.loading")
                      : $t("checkout.apply")
                  }}
                </button>
              </div>
              <p
                v-if="promoMessage"
                class="mt-2 text-xs"
                :class="
                  promoDiscount > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                "
              >
                {{ promoMessage }}
              </p>
            </div>

            <div
              class="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm"
            >
              <div
                class="flex justify-between text-zinc-500 dark:text-zinc-400"
              >
                <span>{{ $t("cart.subtotal") }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">{{
                  formatPrice(cartSubtotal)
                }}</span>
              </div>
              <div
                class="flex justify-between text-zinc-500 dark:text-zinc-400"
              >
                <span>{{ $t("cart.shipping") }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">
                  {{
                    deliveryMethod === "express"
                      ? formatPrice(expressShippingFee)
                      : $t("cart.free")
                  }}
                </span>
              </div>
              <div
                class="flex justify-between text-zinc-500 dark:text-zinc-400"
              >
                <span>{{ $t("checkout.estimatedTax") }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white">{{
                  formatPrice(cartTax)
                }}</span>
              </div>
              <div
                class="flex justify-between text-zinc-500 dark:text-zinc-400"
              >
                <span>{{ $t("cart.promoDiscount") }}</span>
                <span class="font-semibold text-zinc-900 dark:text-white"
                  >-{{ formatPrice(promoDiscount) }}</span
                >
              </div>
              <div
                class="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800"
              >
                <span class="font-bold text-zinc-900 dark:text-white">{{
                  $t("cart.total")
                }}</span>
                <span
                  class="text-xl font-black text-zinc-900 dark:text-zinc-100"
                  >{{ formatPrice(grandTotal) }}</span
                >
              </div>
            </div>
          </template>
        </div>

        <div
          class="mt-4 flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400"
        >
          <span class="material-symbols-outlined text-lg">lock</span>
          <span class="text-xs font-medium">{{
            $t("checkout.secureBadge")
          }}</span>
        </div>
        <p class="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {{ $t("checkout.termsNote") }}
          <RouterLink to="/" class="underline hover:text-primary">{{
            $t("checkout.terms")
          }}</RouterLink>
          {{ $t("checkout.termsAnd") }}
          <RouterLink to="/" class="underline hover:text-primary">{{
            $t("checkout.privacy")
          }}</RouterLink
          >.
        </p>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import QRCode from "qrcode";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import { useCart } from "@/composables/useCart.js";
import { useAuth } from "@/composables/useAuth.js";
import orderService from "@/services/orderService.js";
import { AUTH_TOKEN_KEY } from "@/services/api.js";
import fakePaymentService from "@/services/fakePaymentService.js";
import { useNotification } from "@/composables/useNotification.js";
import {
  invalidateOrders,
  invalidateProducts,
  invalidateProductDetail,
} from "@/utils/cache.js";
import {
  validatePromoCode,
  getAvailablePromoCodes,
  claimPromoCode,
  getMyVouchers,
} from "@/services/promoCodeService.js";

const { t: $t } = useI18n();
const { user } = useAuth();
const router = useRouter();
const cart = useCart();
const cartItems = cart.items;
const cartSubtotal = cart.subtotal;
const cartTax = cart.tax;
const { showNotification } = useNotification();

const stepOpen = ref(1);
const deliveryMethod = ref("standard");
const paymentMethod = ref(null); // 'bank_transfer' | 'direct'
const expressShippingFee = 15000;
const promoCode = ref("");
const promoDiscountAmount = ref(0);
const appliedPromoCode = ref("");
const promoMessage = ref("");
const isApplyingPromo = ref(false);
const availableVouchers = ref([]);
const myVouchers = ref([]);
const loadingAvailableVouchers = ref(false);
const loadingMyVouchers = ref(false);
const claimingVoucherId = ref(null);
const claimedVoucherCodeOverrides = ref([]);
const claimedVoucherIdOverrides = ref([]);
const PROMO_STORAGE_KEY = "kinhmat_applied_promo";
const shipping = ref({
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
});

const provinceOptions = ref([]);
const wardOptions = ref([]);
const loadingProvinces = ref(false);
const loadingWards = ref(false);
const provinceQuery = ref("");
const wardQuery = ref("");
const provinceOpen = ref(false);
const wardOpen = ref(false);
const PROVINCE_API_BASE = "https://provinces.open-api.vn/api";

function normalizeKeyword(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function syncWardQueryFromCity() {
  if (!shipping.value.city) {
    wardQuery.value = "";
    return;
  }
  const w = wardOptions.value.find(
    (ward) => ward.name === shipping.value.city,
  );
  wardQuery.value = w ? w.label : shipping.value.city;
}

function selectProvince(province) {
  shipping.value.state = province.name;
  provinceQuery.value = province.name;
  provinceOpen.value = false;
}

function selectWard(ward) {
  shipping.value.city = ward.name;
  wardQuery.value = ward.label;
  wardOpen.value = false;
}

function closeProvinceDropdown() {
  provinceOpen.value = false;
}

function closeWardDropdown() {
  wardOpen.value = false;
}

function onProvinceFocus() {
  provinceOpen.value = true;
}

function onWardFocus() {
  if (!shipping.value.state || loadingWards.value) return;
  wardOpen.value = true;
}

function toggleProvinceDropdown() {
  if (loadingProvinces.value) return;
  provinceOpen.value = !provinceOpen.value;
}

function toggleWardDropdown() {
  if (!shipping.value.state || loadingWards.value) return;
  wardOpen.value = !wardOpen.value;
}

function onProvinceInput() {
  const pq = provinceQuery.value.trim();
  const st = (shipping.value.state || "").trim();
  if (pq !== st) {
    shipping.value.state = "";
    shipping.value.city = "";
    wardQuery.value = "";
  }
}

function onWardInput() {
  const current = wardOptions.value.find(
    (ward) => ward.name === shipping.value.city,
  );
  const expectedLabel = (current?.label || "").trim();
  const q = wardQuery.value.trim();
  const city = (shipping.value.city || "").trim();
  if (shipping.value.city && q !== expectedLabel && q !== city) {
    shipping.value.city = "";
  }
}

function onProvinceBlur() {
  window.setTimeout(() => {
    provinceOpen.value = false;
    const q = provinceQuery.value.trim();
    if (!q) {
      shipping.value.state = "";
      shipping.value.city = "";
      provinceQuery.value = "";
      wardQuery.value = "";
      return;
    }
    const exact = provinceOptions.value.find((p) => p.name === q);
    if (exact) {
      shipping.value.state = exact.name;
      provinceQuery.value = exact.name;
      return;
    }
    const loose = provinceOptions.value.find(
      (p) => normalizeKeyword(p.name) === normalizeKeyword(q),
    );
    if (loose) {
      shipping.value.state = loose.name;
      provinceQuery.value = loose.name;
      return;
    }
    provinceQuery.value = shipping.value.state || "";
    if (!shipping.value.state) {
      wardQuery.value = "";
    }
  }, 200);
}

function onWardBlur() {
  window.setTimeout(() => {
    wardOpen.value = false;
    if (!shipping.value.state) {
      wardQuery.value = "";
      return;
    }
    const q = wardQuery.value.trim();
    if (!q) {
      shipping.value.city = "";
      wardQuery.value = "";
      return;
    }
    const byLabel = wardOptions.value.find((w) => w.label === q);
    if (byLabel) {
      shipping.value.city = byLabel.name;
      wardQuery.value = byLabel.label;
      return;
    }
    const byName = wardOptions.value.find((w) => w.name === q);
    if (byName) {
      shipping.value.city = byName.name;
      wardQuery.value = byName.label;
      return;
    }
    const loose = wardOptions.value.find(
      (w) =>
        normalizeKeyword(w.label) === normalizeKeyword(q) ||
        normalizeKeyword(w.name) === normalizeKeyword(q),
    );
    if (loose) {
      shipping.value.city = loose.name;
      wardQuery.value = loose.label;
      return;
    }
    syncWardQueryFromCity();
  }, 200);
}

async function loadProvinceOptions() {
  loadingProvinces.value = true;
  try {
    const response = await fetch(`${PROVINCE_API_BASE}/?depth=1`);
    if (!response.ok) throw new Error("Cannot load province list");
    const data = await response.json();
    provinceOptions.value = (Array.isArray(data) ? data : [])
      .map((province) => ({
        code: Number(province.code),
        name: String(province.name || "").trim(),
      }))
      .filter((province) => Number.isFinite(province.code) && province.name)
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } catch {
    provinceOptions.value = [];
    showNotification({
      message: "Không tải được danh sách Tỉnh / Thành.",
      type: "error",
      duration: 3500,
    });
  } finally {
    loadingProvinces.value = false;
  }
}

async function loadWardOptionsByProvinceName(provinceName) {
  const selected = provinceOptions.value.find((p) => p.name === provinceName);
  if (!selected?.code) {
    wardOptions.value = [];
    return;
  }
  loadingWards.value = true;
  try {
    const response = await fetch(`${PROVINCE_API_BASE}/p/${selected.code}?depth=3`);
    if (!response.ok) throw new Error("Cannot load ward list");
    const data = await response.json();
    const districts = Array.isArray(data?.districts) ? data.districts : [];
    wardOptions.value = districts
      .flatMap((district) =>
        (Array.isArray(district?.wards) ? district.wards : []).map((ward) => {
          const districtName = String(district?.name || "").trim();
          const wardName = String(ward?.name || "").trim();
          const label = districtName ? `${wardName} - ${districtName}` : wardName;
          return {
            key: `${districtName}-${wardName}`,
            name: wardName,
            district: districtName,
            label,
          };
        }),
      )
      .filter((ward) => ward.name)
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  } catch {
    wardOptions.value = [];
    showNotification({
      message: "Không tải được danh sách Xã / Phường.",
      type: "error",
      duration: 3500,
    });
  } finally {
    loadingWards.value = false;
  }
}

const filteredProvinceOptions = computed(() => {
  const keyword = normalizeKeyword(provinceQuery.value);
  if (!keyword) return provinceOptions.value;
  return provinceOptions.value.filter((province) =>
    normalizeKeyword(province.name).includes(keyword),
  );
});

const filteredWardOptions = computed(() => {
  const keyword = normalizeKeyword(wardQuery.value);
  if (!keyword) return wardOptions.value;
  return wardOptions.value.filter(
    (ward) =>
      normalizeKeyword(ward.name).includes(keyword) ||
      normalizeKeyword(ward.district).includes(keyword) ||
      normalizeKeyword(ward.label).includes(keyword),
  );
});

watch(
  () => shipping.value.state,
  async (newState, oldState) => {
    if (newState !== oldState) {
      shipping.value.city = "";
      wardQuery.value = "";
    }
    if (!newState) {
      wardOptions.value = [];
      return;
    }
    await loadWardOptionsByProvinceName(newState);
  },
);

watch(
  () => provinceOptions.value.length,
  (count) => {
    if (!count) return;
    const stillValid = provinceOptions.value.some(
      (province) => province.name === shipping.value.state,
    );
    if (!stillValid) {
      shipping.value.state = "";
      shipping.value.city = "";
      provinceQuery.value = "";
      wardQuery.value = "";
    }
  },
);

watch(
  () => wardOptions.value.length,
  () => {
    const stillValid = wardOptions.value.some(
      (ward) => ward.name === shipping.value.city,
    );
    if (!stillValid) {
      shipping.value.city = "";
      wardQuery.value = "";
    } else {
      syncWardQueryFromCity();
    }
  },
);

const isPlacingOrder = ref(false);
const isStartingFakePayment = ref(false);
const fakePaymentSession = ref(null);
const fakeQrDataUrl = ref("");
const fakePaymentError = ref("");
const fakeCountdownSeconds = ref(0);
let fakePaymentPollTimer = null;
let fakePaymentCountdownTimer = null;
const CHECKOUT_FAKE_PAYMENT_STORAGE_KEY = "checkout_fake_payment_session";

function redirectToLoginForCheckout() {
  showNotification({
    message: "Vui lòng đăng nhập để đặt hàng.",
    type: "error",
    duration: 3500,
  });
  router.push({
    name: "Login",
    query: { redirect: "/checkout" },
  });
}

function clearAuthAndRedirectToLogin() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("user");
  redirectToLoginForCheckout();
}

function parsePrice(value) {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const cleaned = String(value)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function formatPrice(price) {
  const num = Math.round(parsePrice(price));
  return `${num.toLocaleString("vi-VN")} đ`;
}

function formatVndNoSuffix(value) {
  const num = Math.round(parsePrice(value));
  return `${num.toLocaleString("vi-VN")}`;
}

const shippingTotal = computed(() =>
  deliveryMethod.value === "express" ? expressShippingFee : 0,
);
const promoDiscount = computed(() =>
  Math.max(0, Number(promoDiscountAmount.value || 0)),
);
const promoProductIds = computed(() =>
  (cartItems.value ?? [])
    .map((i) => Number(i.productId))
    .filter((id) => Number.isFinite(id)),
);
const claimedVoucherCodes = computed(
  () =>
    new Set([
      ...(myVouchers.value || [])
        .map((v) =>
          String(v.code || "")
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
      ...claimedVoucherCodeOverrides.value,
    ]),
);
const claimedVoucherIds = computed(
  () =>
    new Set([
      ...(myVouchers.value || [])
        .map((v) => Number(v.id))
        .filter((id) => Number.isFinite(id)),
      ...claimedVoucherIdOverrides.value,
    ]),
);

function isVoucherClaimed(voucher) {
  const voucherId = Number(voucher?.id);
  const code = String(voucher?.code || "")
    .trim()
    .toUpperCase();
  return (
    (Number.isFinite(voucherId) && claimedVoucherIds.value.has(voucherId)) ||
    (code && claimedVoucherCodes.value.has(code))
  );
}

async function loadAvailableVouchers() {
  if (!user.value?.id) return;
  loadingAvailableVouchers.value = true;
  try {
    availableVouchers.value = await getAvailablePromoCodes(
      promoProductIds.value,
    );
  } catch {
    availableVouchers.value = [];
  } finally {
    loadingAvailableVouchers.value = false;
  }
}

async function loadMyVouchers() {
  if (!user.value?.id) return;
  loadingMyVouchers.value = true;
  try {
    myVouchers.value = await getMyVouchers(promoProductIds.value);
  } catch {
    myVouchers.value = [];
  } finally {
    loadingMyVouchers.value = false;
  }
}

async function claimVoucher(voucher) {
  const voucherId = voucher?.id;
  if (!voucherId || claimingVoucherId.value) return;
  const code = String(voucher?.code || "")
    .trim()
    .toUpperCase();
  if (isVoucherClaimed(voucher)) return;
  claimingVoucherId.value = voucherId;
  try {
    const result = await claimPromoCode(voucherId);
    const idNum = Number(voucherId);
    if (code && !claimedVoucherCodeOverrides.value.includes(code)) {
      claimedVoucherCodeOverrides.value = [
        ...claimedVoucherCodeOverrides.value,
        code,
      ];
    }
    if (
      Number.isFinite(idNum) &&
      !claimedVoucherIdOverrides.value.includes(idNum)
    ) {
      claimedVoucherIdOverrides.value = [
        ...claimedVoucherIdOverrides.value,
        idNum,
      ];
    }
    showNotification({
      message: String(result?.message || "Đã lưu voucher thành công."),
      type: "success",
      duration: 2800,
    });
    await loadMyVouchers();
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("claim voucher này trước đó") || msg.includes("already")) {
      const idNum = Number(voucherId);
      if (code && !claimedVoucherCodeOverrides.value.includes(code)) {
        claimedVoucherCodeOverrides.value = [
          ...claimedVoucherCodeOverrides.value,
          code,
        ];
      }
      if (
        Number.isFinite(idNum) &&
        !claimedVoucherIdOverrides.value.includes(idNum)
      ) {
        claimedVoucherIdOverrides.value = [
          ...claimedVoucherIdOverrides.value,
          idNum,
        ];
      }
    }
    showNotification({
      message: err?.message || "Không thể lưu voucher.",
      type: "error",
      duration: 3500,
    });
  } finally {
    claimingVoucherId.value = null;
  }
}

function selectVoucher(voucher) {
  const code = String(voucher?.code || "")
    .trim()
    .toUpperCase();
  if (!code) return;
  promoCode.value = code;
  applyPromoCode();
}

function isVoucherUsedByCurrentUser(code) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) return false;
  const matches = (myVouchers.value || []).filter(
    (v) =>
      String(v?.code || "")
        .trim()
        .toUpperCase() === normalized,
  );
  if (!matches.length) return false;
  return matches.some((matched) => {
    const raw = matched.raw || {};
    const usedAt =
      matched.usedAt ??
      raw.used_at ??
      raw.usedAt ??
      raw?.pivot?.used_at ??
      raw?.user_promo?.used_at ??
      raw?.usage?.used_at ??
      raw?.meta?.used_at ??
      null;
    return usedAt != null && String(usedAt).trim() !== "";
  });
}

function getVoucherMinOrderAmountByCode(code) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) return 0;
  const source = [
    ...(myVouchers.value || []),
    ...(availableVouchers.value || []),
  ];
  const matches = source.filter(
    (v) =>
      String(v?.code || "")
        .trim()
        .toUpperCase() === normalized,
  );
  if (!matches.length) return 0;
  const values = matches.map((matched) => {
    const raw = matched.raw || {};
    const minAmount = Number(
      matched.minOrderAmount ??
        raw.min_order_amount ??
        raw.minimum_order_amount ??
        raw?.promo_code?.min_order_amount ??
        raw?.promo?.min_order_amount ??
        0,
    );
    return Number.isFinite(minAmount) ? minAmount : 0;
  });
  return Math.max(...values, 0);
}

const grandTotal = computed(() => {
  const sub = cartSubtotal?.value ?? cartSubtotal ?? 0;
  const tax = cartTax?.value ?? cartTax ?? 0;
  const ship = shippingTotal.value;
  const discount = promoDiscount.value;
  return Math.max(0, sub + tax + ship - discount);
});

async function applyPromoCode({ silent = false } = {}) {
  const code = String(promoCode.value || "")
    .trim()
    .toUpperCase();
  promoCode.value = code;
  if (!code) {
    promoDiscountAmount.value = 0;
    appliedPromoCode.value = "";
    promoMessage.value = "";
    try {
      sessionStorage.removeItem(PROMO_STORAGE_KEY);
    } catch (_) {}
    return;
  }
  if (isVoucherUsedByCurrentUser(code)) {
    promoDiscountAmount.value = 0;
    appliedPromoCode.value = "";
    promoMessage.value = "Mã này đã được sử dụng rồi.";
    try {
      sessionStorage.removeItem(PROMO_STORAGE_KEY);
    } catch (_) {}
    if (!silent) {
      showNotification({
        message: promoMessage.value,
        type: "error",
        duration: 3500,
      });
    }
    return;
  }
  const subtotalNow = Number(cartSubtotal.value ?? 0) || 0;
  const minOrderByVoucher = getVoucherMinOrderAmountByCode(code);
  if (minOrderByVoucher > 0 && subtotalNow < minOrderByVoucher) {
    promoDiscountAmount.value = 0;
    appliedPromoCode.value = "";
    promoMessage.value = `Giá trị đơn tối thiếu chưa đủ ${formatVndNoSuffix(minOrderByVoucher)}vnđ`;
    try {
      sessionStorage.removeItem(PROMO_STORAGE_KEY);
    } catch (_) {}
    if (!silent) {
      showNotification({
        message: promoMessage.value,
        type: "error",
        duration: 3500,
      });
    }
    return;
  }
  isApplyingPromo.value = true;
  try {
    const result = await validatePromoCode({
      code,
      subtotal: cartSubtotal.value ?? 0,
      product_ids: promoProductIds.value,
    });
    if (!result.valid) {
      promoDiscountAmount.value = 0;
      appliedPromoCode.value = "";
      const subtotalNow = Number(cartSubtotal.value ?? 0) || 0;
      const minOrderAmount = Number(result.minOrderAmount || 0) || 0;
      if (isPromoAlreadyUsedMessage(result.message)) {
        promoMessage.value = "Mã này đã được sử dụng rồi.";
      } else if (minOrderAmount > 0 && subtotalNow < minOrderAmount) {
        promoMessage.value = `Giá trị đơn tối thiếu chưa đủ ${formatVndNoSuffix(minOrderAmount)}vnđ`;
      } else if (isPromoMinOrderMessage(result.message) && minOrderAmount > 0) {
        promoMessage.value = `Giá trị đơn tối thiếu chưa đủ ${formatVndNoSuffix(minOrderAmount)}vnđ`;
      } else {
        promoMessage.value = result.message || "Mã khuyến mãi không hợp lệ.";
      }
      try {
        sessionStorage.removeItem(PROMO_STORAGE_KEY);
      } catch (_) {}
      if (!silent) {
        showNotification({
          message: promoMessage.value,
          type: "error",
          duration: 3500,
        });
      }
      return;
    }
    promoDiscountAmount.value = Math.max(0, Number(result.discountAmount || 0));
    appliedPromoCode.value = code;
    promoMessage.value = result.message || "Áp dụng mã khuyến mãi thành công.";
    try {
      sessionStorage.setItem(
        PROMO_STORAGE_KEY,
        JSON.stringify({
          code: appliedPromoCode.value,
          discount: promoDiscountAmount.value,
        }),
      );
    } catch (_) {}
    if (!silent) {
      showNotification({
        message: promoMessage.value,
        type: "success",
        duration: 3000,
      });
    }
  } catch (err) {
    if (!silent) {
      showNotification({
        message: err?.message || "Không thể kiểm tra mã khuyến mãi.",
        type: "error",
        duration: 3500,
      });
    }
  } finally {
    isApplyingPromo.value = false;
  }
}

const canPlaceOrder = computed(() => {
  if (!(cartItems.value ?? []).length) return false;
  const s = shipping.value;
  const hasShipping = !!(
    s.name?.trim() &&
    s.phone?.trim() &&
    s.email?.trim() &&
    s.address?.trim() &&
    s.state?.trim() &&
    s.city?.trim()
  );
  const hasPayment =
    paymentMethod.value === "bank_transfer" ||
    paymentMethod.value === "direct";
  return hasShipping && hasPayment;
});

const canSubmitOrder = computed(() => {
  if (paymentMethod.value !== "bank_transfer") return true;
  return fakePaymentSession.value?.status === "paid";
});

const checkoutButtonText = computed(() => {
  if (paymentMethod.value === "bank_transfer") {
    if (fakePaymentSession.value?.status === "paid") {
      return `${$t("checkout.placeOrder")} - ${formatPrice(grandTotal.value)}`;
    }
    if (isStartingFakePayment.value) return "Đang tạo mã QR...";
    return `Thanh toán QR - ${formatPrice(grandTotal.value)}`;
  }
  return `${$t("checkout.placeOrder")} - ${formatPrice(grandTotal.value)}`;
});

const fakePaymentStatusText = computed(() => {
  const status = String(fakePaymentSession.value?.status || "pending");
  if (status === "scanned") return "Đã quét, chờ xác nhận";
  if (status === "paid") return "Thanh toán thành công";
  if (status === "expired") return "Mã hết hạn";
  if (status === "cancelled") return "Mã đã huỷ";
  return "Chờ quét";
});

const fakeCountdownText = computed(() => {
  const sec = Math.max(0, Number(fakeCountdownSeconds.value || 0));
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
});

const shouldShowRegenerateFakeQr = computed(() =>
  ["expired", "cancelled"].includes(String(fakePaymentSession.value?.status || "")),
);

function persistFakePaymentSession() {
  try {
    if (!fakePaymentSession.value?.session_id) {
      sessionStorage.removeItem(CHECKOUT_FAKE_PAYMENT_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(
      CHECKOUT_FAKE_PAYMENT_STORAGE_KEY,
      JSON.stringify({
        session_id: fakePaymentSession.value.session_id,
      }),
    );
  } catch (_) {}
}

function stopFakePaymentTimers() {
  if (fakePaymentPollTimer) {
    clearInterval(fakePaymentPollTimer);
    fakePaymentPollTimer = null;
  }
  if (fakePaymentCountdownTimer) {
    clearInterval(fakePaymentCountdownTimer);
    fakePaymentCountdownTimer = null;
  }
}

function updateCountdownByExpiresAt(expiresAt) {
  if (!expiresAt) {
    fakeCountdownSeconds.value = 0;
    return;
  }
  const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  fakeCountdownSeconds.value = Math.max(0, diff);
}

async function renderQrContent(content) {
  fakeQrDataUrl.value = "";
  if (!content) return;
  fakeQrDataUrl.value = await QRCode.toDataURL(content, {
    margin: 1,
    width: 320,
  });
}

function resolveMobileQrContent(rawContent, sessionId) {
  const appOrigin =
    String(import.meta.env.VITE_PUBLIC_APP_URL || "").trim() ||
    window.location.origin;
  const fallback = `${appOrigin}/fake-pay/${sessionId}`;
  const text = String(rawContent || "").trim();
  if (!text) return fallback;
  if (text.includes("localhost") || text.includes("127.0.0.1")) return fallback;
  return text;
}

async function syncFakeSessionStatus(sessionId) {
  const res = await fakePaymentService.getSession(sessionId);
  fakePaymentSession.value = {
    session_id: res.session_id,
    status: res.status,
    amount: res.amount,
    currency: res.currency,
    payment_code: res.payment_code,
    expires_at: res.expires_at,
    scanned_at: res.scanned_at,
    paid_at: res.paid_at,
    qr_content: fakePaymentSession.value?.qr_content || "",
  };
  persistFakePaymentSession();
  updateCountdownByExpiresAt(fakePaymentSession.value.expires_at);
  if (["paid", "expired", "cancelled"].includes(String(fakePaymentSession.value.status || ""))) {
    stopFakePaymentTimers();
  }
}

function startFakePaymentCountdown() {
  if (fakePaymentCountdownTimer) clearInterval(fakePaymentCountdownTimer);
  fakePaymentCountdownTimer = setInterval(async () => {
    if (!fakePaymentSession.value?.expires_at) return;
    updateCountdownByExpiresAt(fakePaymentSession.value.expires_at);
    if (fakeCountdownSeconds.value > 0) return;
    try {
      await syncFakeSessionStatus(fakePaymentSession.value.session_id);
    } catch (_) {
      // Ignore once; polling loop will retry.
    }
  }, 1000);
}

function startFakePaymentPolling() {
  if (!fakePaymentSession.value?.session_id) return;
  if (fakePaymentPollTimer) clearInterval(fakePaymentPollTimer);
  fakePaymentPollTimer = setInterval(async () => {
    try {
      await syncFakeSessionStatus(fakePaymentSession.value.session_id);
      if (fakePaymentSession.value?.status === "paid") {
        showNotification({
          message: "Đã nhận thanh toán thành công.",
          type: "success",
          duration: 2800,
        });
      }
    } catch (err) {
      if (Number(err?.status) === 401) {
        stopFakePaymentTimers();
        clearAuthAndRedirectToLogin();
      }
    }
  }, 1500);
}

async function startFakePaymentSession() {
  if (isStartingFakePayment.value) return;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    redirectToLoginForCheckout();
    return;
  }
  isStartingFakePayment.value = true;
  fakePaymentError.value = "";
  stopFakePaymentTimers();
  try {
    const orderId = null;
    const res = await fakePaymentService.createSession({
      order_id: orderId,
      amount: Math.round(Number(grandTotal.value || 0)),
    });
    const qrContent = resolveMobileQrContent(res.qr_content, res.session_id);
    fakePaymentSession.value = {
      session_id: res.session_id,
      status: res.status,
      amount: res.amount,
      currency: res.currency,
      payment_code: res.payment_code,
      expires_at: res.expires_at,
      scanned_at: null,
      paid_at: null,
      qr_content: qrContent,
    };
    await renderQrContent(qrContent);
    persistFakePaymentSession();
    updateCountdownByExpiresAt(res.expires_at);
    startFakePaymentCountdown();
    startFakePaymentPolling();
  } catch (err) {
    if (Number(err?.status) === 401) {
      clearAuthAndRedirectToLogin();
      return;
    }
    fakePaymentError.value = err?.message || "Không thể tạo mã QR thanh toán.";
  } finally {
    isStartingFakePayment.value = false;
  }
}

async function resumeFakePaymentSessionIfAny() {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_FAKE_PAYMENT_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const sessionId = String(saved?.session_id || "");
    if (!sessionId) return;
    await syncFakeSessionStatus(sessionId);
    const content = resolveMobileQrContent(fakePaymentSession.value?.qr_content, sessionId);
    await renderQrContent(content);
    if (!["paid", "expired", "cancelled"].includes(String(fakePaymentSession.value?.status || ""))) {
      startFakePaymentCountdown();
      startFakePaymentPolling();
    }
  } catch (_) {
    // ignore resume errors
  }
}

async function handleCheckoutAction() {
  if (paymentMethod.value !== "bank_transfer") {
    await placeOrder();
    return;
  }
  const currentStatus = String(fakePaymentSession.value?.status || "");
  if (fakePaymentSession.value?.session_id && !["expired", "cancelled", "paid"].includes(currentStatus)) {
    showNotification({
      message: "Vui lòng quét QR và xác nhận trên điện thoại.",
      type: "error",
      duration: 2400,
    });
    return;
  }
  if (fakePaymentSession.value?.status !== "paid") {
    await startFakePaymentSession();
    return;
  }
  await placeOrder();
}
function isPaymentMethodValidationError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return err?.status === 422 && msg.includes("payment method");
}

function isPromoAlreadyUsedError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("already used") ||
    msg.includes("already redeemed") ||
    msg.includes("already applied") ||
    msg.includes("đã sử dụng") ||
    msg.includes("đã dùng") ||
    msg.includes("đã được sử dụng")
  );
}

function isPromoAlreadyUsedMessage(message) {
  const msg = String(message || "").toLowerCase();
  return (
    msg.includes("already used") ||
    msg.includes("already redeemed") ||
    msg.includes("already applied") ||
    msg.includes("đã sử dụng") ||
    msg.includes("đã dùng") ||
    msg.includes("đã được sử dụng")
  );
}

function isPromoMinOrderMessage(message) {
  const msg = String(message || "").toLowerCase();
  return (
    msg.includes("min_order_amount") ||
    msg.includes("minimum order") ||
    msg.includes("đơn tối thiểu") ||
    msg.includes("đơn hàng tối thiểu") ||
    msg.includes("chưa đủ giá trị")
  );
}

function getPaymentMethodCandidates(uiMethod) {
  if (uiMethod === "bank_transfer")
    return ["bank_transfer", "bank", "transfer"];
  if (uiMethod === "direct") return ["cod", "cash", "direct"];
  return [];
}

async function placeOrder() {
  if (!canPlaceOrder.value || isPlacingOrder.value) return;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    redirectToLoginForCheckout();
    return;
  }
  isPlacingOrder.value = true;
  try {
    const items = (cartItems.value ?? []).map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      unit_price: parsePrice(i.price),
      lens_id: i.lensId ?? null,
    }));
    const s = shipping.value;
    const name = (s.name && String(s.name).trim()) || "";
    const phone = (s.phone && String(s.phone).trim()) || "";
    const email = (s.email && String(s.email).trim()) || "";
    const address = (s.address && String(s.address).trim()) || "";
    const shippingCity = (s.state && String(s.state).trim()) || "";
    const shippingWard = (s.city && String(s.city).trim()) || "";

    if (!name || !phone || !email || !address || !shippingCity || !shippingWard) {
      showNotification({
        message: $t("checkout.errorShippingRequired"),
        type: "error",
        duration: 4000,
      });
      isPlacingOrder.value = false;
      return;
    }

    const method = paymentMethod.value;
    if (method !== "bank_transfer" && method !== "direct") {
      showNotification({
        message: $t("checkout.errorPaymentRequired"),
        type: "error",
        duration: 4000,
      });
      isPlacingOrder.value = false;
      return;
    }
    const paymentStatus = method === "bank_transfer" ? "paid" : "pending";
    const basePayload = {
      shipping_name: name,
      shipping_phone: phone,
      shipping_email: email,
      shipping_address: address,
      shipping_city: shippingCity,
      shipping_ward: shippingWard,
      shipping_postal_code: "",
      shipping_country: "Vietnam",
      shipping: {
        name,
        phone,
        email,
        address,
        city: shippingCity || null,
        ward: shippingWard || null,
        state: shippingCity || null,
      },
      items,
      delivery_method: deliveryMethod.value,
      payment_status: paymentStatus,
      status: paymentStatus === "paid" ? "completed" : "pending",
    };
    if (appliedPromoCode.value) {
      basePayload.promo_code = appliedPromoCode.value;
    }
    const methodCandidates = getPaymentMethodCandidates(method);
    let data = null;
    let lastErr = null;
    for (const apiMethod of methodCandidates) {
      try {
        data = await orderService.createOrder({
          ...basePayload,
          payment_method: apiMethod,
        });
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        if (!isPaymentMethodValidationError(err)) {
          throw err;
        }
      }
    }
    if (!data) {
      throw lastErr || new Error($t("checkout.errorPaymentRequired"));
    }
    const orderId = data.id ?? data.data?.id;
    if (orderId) {
      invalidateOrders();
      invalidateProducts();
      // Xóa thêm cache chi tiết của các sản phẩm vừa mua để đảm bảo stock hiển thị mới nhất.
      for (const item of items) {
        if (item?.product_id != null) {
          invalidateProductDetail(item.product_id);
        }
      }
      if (method === "bank_transfer") {
        showNotification({
          message: "Thanh toán chuyển khoản thành công.",
          type: "success",
          duration: 4000,
        });
        stopFakePaymentTimers();
        fakePaymentSession.value = null;
        fakeQrDataUrl.value = "";
        fakePaymentError.value = "";
        fakeCountdownSeconds.value = 0;
        persistFakePaymentSession();
      }
      if (method === "direct") {
        showNotification({
          message: $t("checkout.payDirectPending"),
          type: "success",
          duration: 5000,
        });
      }
      cart.clear();
      try {
        sessionStorage.removeItem(PROMO_STORAGE_KEY);
      } catch (_) {}
      router.push("/dashboard/orders");
    }
  } catch (e) {
    console.error("Create order failed:", e);
    if (Number(e?.status) === 401) {
      redirectToLoginForCheckout();
      return;
    }
    if (isPromoAlreadyUsedError(e)) {
      promoDiscountAmount.value = 0;
      appliedPromoCode.value = "";
      promoMessage.value = "Mã này đã được sử dụng rồi.";
      showNotification({
        message: promoMessage.value,
        type: "error",
        duration: 4000,
      });
      return;
    }
    showNotification({
      message: $t("checkout.errorCreateOrder"),
      type: "error",
      duration: 4000,
    });
  } finally {
    isPlacingOrder.value = false;
  }
}

onMounted(() => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    redirectToLoginForCheckout();
    return;
  }
  if (!(cartItems.value ?? []).length) {
    router.replace("/cart");
    return;
  }
  if (user.value?.id) {
    loadAvailableVouchers();
    loadMyVouchers();
  }
  loadProvinceOptions();
  resumeFakePaymentSessionIfAny();
  try {
    const raw = sessionStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const savedCode = String(saved?.code || "")
      .trim()
      .toUpperCase();
    if (!savedCode) return;
    promoCode.value = savedCode;
    applyPromoCode({ silent: true });
  } catch (_) {
    // ignore parse/storage errors
  }
});

watch(
  () => paymentMethod.value,
  async (method) => {
    if (method !== "bank_transfer") return;
    if (fakePaymentSession.value?.session_id) return;
    await startFakePaymentSession();
  },
);

onBeforeUnmount(() => {
  stopFakePaymentTimers();
});
</script>
