import { api } from '@/services/api'

function normalizeSettingsPayload(payload) {
  if (!payload || typeof payload !== 'object') return {}
  if (payload.data && typeof payload.data === 'object') return payload.data
  if (payload.settings && typeof payload.settings === 'object') return payload.settings
  return payload
}

export async function getGeneral() {
  const res = await api.get('/settings/general')
  return normalizeSettingsPayload(res)
}

export default {
  getGeneral,
}
