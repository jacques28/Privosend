interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimits = new Map<string, RateLimitEntry>()

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_UPLOADS_PER_IP = 10
const MAX_DOWNLOADS_PER_IP = 50

function getClientIP(request: Request): string {
  // Get client IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  return forwarded?.split(',')[0]?.trim() || 
         realIP || 
         'unknown'
}

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const entry = rateLimits.get(key)
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    rateLimits.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (entry.count >= maxRequests) {
    return false
  }
  
  entry.count++
  return true
}

export function checkUploadRateLimit(request: Request): boolean {
  const ip = getClientIP(request)
  return checkRateLimit(`upload:${ip}`, MAX_UPLOADS_PER_IP)
}

export function checkDownloadRateLimit(request: Request): boolean {
  const ip = getClientIP(request)
  return checkRateLimit(`download:${ip}`, MAX_DOWNLOADS_PER_IP)
}

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetTime) {
      rateLimits.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW)