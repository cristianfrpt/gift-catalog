const requests = new Map()

export function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now()

  if (!requests.has(ip)) {
    requests.set(ip, [])
  }

  const timestamps = requests
    .get(ip)
    .filter((time) => now - time < windowMs)

  timestamps.push(now)

  requests.set(ip, timestamps)

  return timestamps.length <= limit
}