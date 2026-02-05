export function decodeJwtPayload(token: string | null): any | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    // Normalize base64url to base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // Decode in Node or browser
    let jsonStr: string
    if (typeof window === 'undefined') {
      jsonStr = Buffer.from(b64, 'base64').toString('utf8')
    } else {
      jsonStr = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    }
    return JSON.parse(jsonStr)
  } catch (err) {
    // silent failure
    return null
  }
}

export function getTenantIdFromToken(token: string | null): string | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  return payload.tenantId ? String(payload.tenantId) : null
}
