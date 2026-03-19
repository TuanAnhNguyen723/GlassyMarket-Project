<template>
  <main class="max-w-[1440px] mx-auto px-6 lg:px-20">
    <HomeHero :image-url="heroImage" image-alt="Young model wearing stylish premium blue light glasses" />
    <HomeBadges :badges="badges" />
    <HomeBestSellers
      title="Sản phẩm nổi bật"
      subtitle="Những mẫu được chọn lọc dành cho bạn"
      :products="featuredProducts"
      @add-to-cart="onAddToCart"
    />
    <HomePromoBanner />
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import HomeBadges from '@/components/features/home/HomeBadges.vue'
import HomeBestSellers from '@/components/features/home/HomeBestSellers.vue'
import HomeHero from '@/components/features/home/HomeHero.vue'
import HomePromoBanner from '@/components/features/home/HomePromoBanner.vue'
import productService from '@/services/productService.js'
import { useCart } from '@/composables/useCart.js'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC78XrlIUgt9nkWLNt3NfDIWgy2lr6lY6gpVcH_rN0j1WahOSQOE6R34uxsqJWjjo2j81tqBSKDn9nLpmXN1PXY4GfpXP55N4Wqh3fFFDSHX274RRd-rBbLdlQvlJ45q-vTmZjJ84oqgq_FjcXEvZttAiDGmHlyTL71VX275kx8BrcXPqGz8DDTh1eljQ1Z0JJBsJtspHvJxVOmXM74vJFm0-9Vvg9cDwAxTfuRJKMhUQFGc31Ejf6Xbr8jOunHVmJ2f6fsyZ5VUuY1'

const badges = [
  { icon: 'local_shipping', title: 'Free Shipping', subtitle: 'On all orders over $150' },
  { icon: 'replay', title: '30-Day Returns', subtitle: 'Hassle-free exchange policy' },
  { icon: 'ar_on_you', title: 'Virtual Try-on', subtitle: 'See how they look on you' },
]

const cart = useCart()

const allProducts = ref([])

function parsePrice(value) {
  if (value == null) return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  const cleaned = String(value).replace(/[^0-9.,-]/g, '').replace(/,/g, '')
  const num = Number.parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

function formatVnd(value) {
  const v = Math.round(parsePrice(value))
  return `${v.toLocaleString('vi-VN')} đ`
}

function getProductImage(p) {
  if (typeof p?.primary_image === 'string' && p.primary_image.trim()) return p.primary_image
  if (Array.isArray(p?.images) && p.images.length) {
    const primary =
      p.images.find((img) => img && (img.is_primary === true || img.is_primary === 1)) || p.images[0]
    if (primary) {
      if (typeof primary.image_url === 'string' && primary.image_url.trim()) return primary.image_url
      if (typeof primary.url === 'string' && primary.url.trim()) return primary.url
    }
  }
  if (typeof p?.image_url === 'string' && p.image_url.trim()) return p.image_url
  if (typeof p?.image === 'string' && p.image.trim()) return p.image
  return ''
}

function normalizeProductsResponse(response) {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object') {
    if (Array.isArray(response.data)) return response.data
    if (Array.isArray(response.products)) return response.products
  }
  return []
}

const featuredProducts = computed(() => {
  const list = allProducts.value.filter((p) => p && (p.is_featured === true || p.is_featured === 1))
  return list.slice(0, 4).map((p) => ({
    id: p.id ?? p.product_id ?? null,
    name: p.name ?? p.title ?? 'Sản phẩm',
    subtitle: p.material ?? p.frame_shape ?? p.category?.name ?? '',
    price: formatVnd(p.base_price ?? p.price ?? 0),
    badge: p.tag ?? (p.is_premium ? 'Premium' : null),
    alt: p.alt ?? p.name ?? 'Product image',
    image: getProductImage(p),
    raw: p,
  }))
})

async function loadFeaturedProducts() {
  // Ưu tiên backend lọc nếu có hỗ trợ featured=1, fallback sang tự lọc.
  try {
    const res = await productService.getProducts({ featured: 1, limit: 12, per_page: 12 })
    const data = normalizeProductsResponse(res)
    if (data.length) {
      allProducts.value = data
      return
    }
  } catch {
    // ignore -> fallback
  }
  try {
    const res = await productService.getProducts({ limit: 50, per_page: 50 })
    allProducts.value = normalizeProductsResponse(res)
  } catch {
    allProducts.value = []
  }
}

function onAddToCart(product) {
  const raw = product?.raw ?? product
  const productId = raw?.id ?? product?.id
  if (!productId) return
  cart.addItem({
    productId,
    name: raw?.name ?? product?.name,
    price: raw?.base_price ?? raw?.price ?? product?.price,
    image: raw?.primary_image ?? product?.image,
    alt: raw?.name ?? product?.alt,
    lensId: null,
    lensName: '—',
    color: '—',
    frameType: raw?.category?.name ?? '—',
  })
}

onMounted(() => {
  loadFeaturedProducts()
})
</script>
