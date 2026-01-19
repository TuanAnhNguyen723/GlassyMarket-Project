<template>
  <main class="max-w-[1440px] mx-auto px-6 lg:px-20">
    <HomeHero :image-url="heroImage" image-alt="Young model wearing stylish premium blue light glasses" />
    <HomeBadges :badges="badges" />
    <HomeBestSellers :products="products" @add-to-cart="onAddToCart" />
    <HomePromoBanner />
  </main>
</template>

<script setup>
import HomeBadges from '@/components/features/home/HomeBadges.vue'
import HomeBestSellers from '@/components/features/home/HomeBestSellers.vue'
import HomeHero from '@/components/features/home/HomeHero.vue'
import HomePromoBanner from '@/components/features/home/HomePromoBanner.vue'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC78XrlIUgt9nkWLNt3NfDIWgy2lr6lY6gpVcH_rN0j1WahOSQOE6R34uxsqJWjjo2j81tqBSKDn9nLpmXN1PXY4GfpXP55N4Wqh3fFFDSHX274RRd-rBbLdlQvlJ45q-vTmZjJ84oqgq_FjcXEvZttAiDGmHlyTL71VX275kx8BrcXPqGz8DDTh1eljQ1Z0JJBsJtspHvJxVOmXM74vJFm0-9Vvg9cDwAxTfuRJKMhUQFGc31Ejf6Xbr8jOunHVmJ2f6fsyZ5VUuY1'

const badges = [
  { icon: 'local_shipping', title: 'Free Shipping', subtitle: 'On all orders over $150' },
  { icon: 'replay', title: '30-Day Returns', subtitle: 'Hassle-free exchange policy' },
  { icon: 'ar_on_you', title: 'Virtual Try-on', subtitle: 'See how they look on you' },
]

const products = [
  {
    name: 'The Maverick',
    subtitle: 'Matte Tortoiseshell',
    price: '$120',
    badge: 'Premium',
    alt: 'Classic Maverick style tortoiseshell eyeglasses',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM4oMvefhulnwZqp3ndlA3zk_R2tveNvCawUPCQfMDD8BVzsLIEW9IxpFelSai2g1Kj3RQFt_eQJKdgMzjUfjQitAwemrIZ4lUa7gWsSlZ8_Yf78lu4_GcpyjgIMEWXM3Nos3fPQprt9tUZrzOdMayXRxATgBJHANvGydnWtpn9YVbkrciBcHfxD53WubUqej8Uh9mBn_YtNL0ymadkdxkIhHv8FPRAu1PU1xxI7NEL_tCGiDybzhBFpil8zk9I3T_1CsBwJ7f2tSC',
  },
  {
    name: 'The Urbanite',
    subtitle: 'Midnight Chrome',
    price: '$145',
    badge: null,
    alt: 'Urbanite style sleek black metal frames',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzdKmFXrcqYSWuACYf8pByvTgvJJM678JGozMLH7_H_gn_KbX9b1dozI2mW_lwG8ITdhXDk_m3-Njk7GvRMmHLI9yHZHXl_Kig6Zc2blQvdzGkyGJgmrV562J73GYpYEwZDQvxXQz6O7v_6MHL0W4nILBqq3bdRNS9si-2NVT4_QN2tc0l5yz-e1REzCJrWYeUF8CqrkV9aodW47vklDF95Bpadx0ukHE2i20HC3Xmw0nh3C116ZXf3GFwvPEGwthi-4evwLRgeBgk',
  },
  {
    name: 'The Classic',
    subtitle: '24k Gold Rim',
    price: '$110',
    badge: null,
    alt: 'Classic gold rimmed circular glasses',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyAIR5kJUy8DRR1TJpcNEHNWUb_dmQTwKpwVwWUJlxcegRI6weX1IY18r8rYtHroMvB-877wZh6hPBW5J0pVq79v4Y53b0wntY5qbS80q0zoJysqnFopQN-oXU8oPwKl0fV6QTE8uNXb3rHXWRQnd2sc1iGwwTJe3nsL14wiDr4qWc0zvZPR0G3FamQ_TL04MxpxP6Qh1vZRosjuVEQO8XCKGjWs20UzB4A18xT-iFR5UbYG_BvnYHLdKWOq6eevxvFOenk1kdwvT-',
  },
  {
    name: 'The Minimalist',
    subtitle: 'Crystal Clear',
    price: '$135',
    badge: 'New',
    alt: 'Minimalist clear crystal frames for modern look',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDBdDEO55EKHajg-BZvjpDzyYypdpxKgWbxoQgfE_tjE14nCi1QCEzd8wc7PXX3VrjrevP5wqwqEf3piV9Gp1CqmkxhpPtehOodzbLDumr2yDrt2uL7gRNqaO2S7hXnYbLUO6afAdCih_wf_JB9ikBT0-yeEUoVpXXVcBJme90zB--U06DyIybSyZxeDfzHvMHJv08QG9mpdFH1ti59yjWfT8gH-p-5bTvjFLG4fyWiHwhPUgKdiakshxO6KMLKXeLIuRBU8RpxBVr',
  },
]

function onAddToCart(product) {
  // TODO: tích hợp cart store/service sau
  console.log('add to cart', product)
}
</script>
