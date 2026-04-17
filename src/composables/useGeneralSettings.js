import { computed, ref } from 'vue'
import settingsService from '@/services/settingsService'

const SETTINGS_CACHE_KEY = 'kinhmat_general_settings'
// Signed URL (banner) có hạn, giữ cache ngắn để tránh URL hết hạn.
const SETTINGS_CACHE_TTL_MS = 2 * 60 * 1000

const settings = ref({})
const isLoading = ref(false)
const isInitialized = ref(false)

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function sanitizeText(value) {
  return isNonEmptyString(value) ? value.trim() : ''
}

function sanitizeUrl(value) {
  return isNonEmptyString(value) ? value.trim() : ''
}

function normalizeSettings(raw) {
  if (!raw || typeof raw !== 'object') return {}
  return {
    store_name: sanitizeText(raw.store_name),
    site_logo_url: sanitizeUrl(raw.site_logo_url),
    hero_image_url: sanitizeUrl(raw.hero_image_url),
    banner_primary_url: sanitizeUrl(raw.banner_primary_url),
    banner_secondary_url: sanitizeUrl(raw.banner_secondary_url),
    banner_primary_link: sanitizeUrl(raw.banner_primary_link),
    banner_secondary_link: sanitizeUrl(raw.banner_secondary_link),
    promo_ticker_enabled: Boolean(raw.promo_ticker_enabled),
    promo_ticker_text: sanitizeText(raw.promo_ticker_text),
    contact_phone: sanitizeText(raw.contact_phone),
    contact_email: sanitizeText(raw.contact_email),
    store_address: sanitizeText(raw.store_address),
    facebook_url: sanitizeUrl(raw.facebook_url),
    zalo_url: sanitizeUrl(raw.zalo_url),
    youtube_url: sanitizeUrl(raw.youtube_url),
    copyright_text: sanitizeText(raw.copyright_text),
  }
}

function readLocalCache() {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) return null
    return normalizeSettings(parsed.value)
  } catch {
    return null
  }
}

function writeLocalCache(value) {
  try {
    localStorage.setItem(
      SETTINGS_CACHE_KEY,
      JSON.stringify({
        value,
        expiresAt: Date.now() + SETTINGS_CACHE_TTL_MS,
      }),
    )
  } catch {
    // ignore localStorage failures
  }
}

async function fetchGeneralSettings({ force = false } = {}) {
  if (isLoading.value) return settings.value
  if (!force && isInitialized.value) return settings.value

  if (!force) {
    const cached = readLocalCache()
    if (cached) {
      settings.value = cached
      isInitialized.value = true
      return settings.value
    }
  }

  isLoading.value = true
  try {
    const data = await settingsService.getGeneral()
    const normalized = normalizeSettings(data)
    settings.value = normalized
    writeLocalCache(normalized)
    isInitialized.value = true
    return settings.value
  } catch (error) {
    const cached = readLocalCache()
    if (cached) {
      settings.value = cached
      isInitialized.value = true
      return settings.value
    }
    if (!isInitialized.value) {
      settings.value = {}
      isInitialized.value = true
    }
    throw error
  } finally {
    isLoading.value = false
  }
}

export function useGeneralSettings() {
  const storeName = computed(() => settings.value.store_name || 'Optic')
  const siteLogoUrl = computed(() => settings.value.site_logo_url || '')
  const heroImageUrl = computed(() => settings.value.hero_image_url || '')
  const bannerPrimaryUrl = computed(() => settings.value.banner_primary_url || '')
  const bannerSecondaryUrl = computed(() => settings.value.banner_secondary_url || '')
  const bannerPrimaryLink = computed(() => settings.value.banner_primary_link || '')
  const bannerSecondaryLink = computed(() => settings.value.banner_secondary_link || '')
  const promoTickerEnabled = computed(() => settings.value.promo_ticker_enabled === true)
  const promoTickerText = computed(() => settings.value.promo_ticker_text || '')
  const contactPhone = computed(() => settings.value.contact_phone || '')
  const contactEmail = computed(() => settings.value.contact_email || '')
  const storeAddress = computed(() => settings.value.store_address || '')
  const facebookUrl = computed(() => settings.value.facebook_url || '')
  const zaloUrl = computed(() => settings.value.zalo_url || '')
  const youtubeUrl = computed(() => settings.value.youtube_url || '')
  const copyrightText = computed(() => settings.value.copyright_text || '')

  return {
    settings,
    isLoading,
    isInitialized,
    fetchGeneralSettings,
    storeName,
    siteLogoUrl,
    heroImageUrl,
    bannerPrimaryUrl,
    bannerSecondaryUrl,
    bannerPrimaryLink,
    bannerSecondaryLink,
    promoTickerEnabled,
    promoTickerText,
    contactPhone,
    contactEmail,
    storeAddress,
    facebookUrl,
    zaloUrl,
    youtubeUrl,
    copyrightText,
  }
}
