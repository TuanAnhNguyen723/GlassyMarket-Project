import api from './api.js'

function normalizeVoucher(item = {}) {
  const nested = item?.promo_code ?? item?.promo ?? item?.voucher ?? {}
  const id =
    item.id ??
    item.promo_id ??
    item.promo_code_id ??
    nested.id ??
    null
  const codeRaw =
    item.code ??
    item.voucher_code ??
    item.promo_code_text ??
    nested.code ??
    nested.promo_code ??
    ''
  return {
    id,
    code: String(codeRaw).trim().toUpperCase(),
    name: String(item.name ?? nested.name ?? item.title ?? codeRaw ?? ''),
    description: String(item.description ?? nested.description ?? item.message ?? ''),
    discountAmount: Number(item.discount_amount ?? item.discountAmount ?? 0),
    minOrderAmount: Number(
      item.min_order_amount ??
      item.minimum_order_amount ??
      nested.min_order_amount ??
      nested.minimum_order_amount ??
      0
    ) || 0,
    usedAt:
      item.used_at ??
      item.usedAt ??
      item?.pivot?.used_at ??
      item?.user_promo?.used_at ??
      item?.usage?.used_at ??
      nested.used_at ??
      null,
    raw: item,
  }
}

function getListFromResponse(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.vouchers)) return response.vouchers
  if (Array.isArray(response?.promo_codes)) return response.promo_codes
  return []
}

function buildProductIdsQuery(productIds = []) {
  const ids = Array.isArray(productIds)
    ? productIds
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))
    : []
  if (!ids.length) return ''
  const params = new URLSearchParams()
  for (const id of ids) {
    params.append('product_ids[]', String(id))
  }
  return `?${params.toString()}`
}

/**
 * Validate promo code before creating order.
 * POST /api/v1/promo-codes/validate
 */
export async function validatePromoCode({ code, subtotal, product_ids = [] }) {
  const payload = {
    code: String(code || '').trim(),
    subtotal: Number(subtotal) || 0,
    product_ids: Array.isArray(product_ids) ? product_ids : [],
  }
  const response = await api.post('/promo-codes/validate', payload)
  const data = response?.data ?? response ?? {}
  return {
    valid: !!data.valid,
    discountAmount: Number(data.discount_amount || 0),
    message: String(data.message || ''),
    minOrderAmount: Number(
      data.min_order_amount ??
      data.minimum_order_amount ??
      data.promo_code?.min_order_amount ??
      data.promo?.min_order_amount ??
      0
    ) || 0,
  }
}

/**
 * GET /api/v1/promo-codes/available
 */
export async function getAvailablePromoCodes(productIds = []) {
  const query = buildProductIdsQuery(productIds)
  const response = await api.get(`/promo-codes/available${query}`)
  return getListFromResponse(response).map(normalizeVoucher)
}

/**
 * POST /api/v1/promo-codes/{id}/claim
 */
export async function claimPromoCode(promoId) {
  const response = await api.post(`/promo-codes/${promoId}/claim`, {})
  return response?.data ?? response ?? {}
}

/**
 * GET /api/v1/promo-codes/my-vouchers
 */
export async function getMyVouchers(productIds = []) {
  const query = buildProductIdsQuery(productIds)
  const response = await api.get(`/promo-codes/my-vouchers${query}`)
  return getListFromResponse(response).map(normalizeVoucher)
}

