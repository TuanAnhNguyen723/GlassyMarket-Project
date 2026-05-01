import api from "./api.js";

function unwrap(payload) {
  return payload?.data ?? payload ?? {};
}

export async function createSession(payload) {
  const response = await api.post("/fake-payments/sessions", payload);
  return unwrap(response);
}

export async function getSession(sessionId) {
  const response = await api.get(`/fake-payments/sessions/${sessionId}`);
  return unwrap(response);
}

export async function scanSession(sessionId) {
  const response = await api.post(`/fake-payments/sessions/${sessionId}/scan`, {});
  return unwrap(response);
}

export async function confirmSession(sessionId, confirmToken) {
  const response = await api.post(`/fake-payments/sessions/${sessionId}/confirm`, {
    confirm_token: confirmToken,
  });
  return unwrap(response);
}

export default {
  createSession,
  getSession,
  scanSession,
  confirmSession,
};
