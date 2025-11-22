interface FileUpload {
  id: string
  originalName: string
  encryptedName: string
  size: number
  encryptedSize: number
}

interface ShareSession {
  shareCode: string
  senderName: string
  files: FileUpload[]
  createdAt: Date
  expiresAt: Date
  downloadCount: number
  maxDownloads: number
}

// In-memory storage for now (in production, use a proper database)
const sessions = new Map<string, ShareSession>()

export function createSession(
  shareCode: string,
  senderName: string,
  files: FileUpload[],
  expirationHours: number = 24
): ShareSession {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000)
  
  const session: ShareSession = {
    shareCode,
    senderName,
    files,
    createdAt: now,
    expiresAt,
    downloadCount: 0,
    maxDownloads: 10 // Limit downloads per session
  }
  
  sessions.set(shareCode, session)
  return session
}

export function getSession(shareCode: string): ShareSession | null {
  const session = sessions.get(shareCode)
  
  if (!session) return null
  
  // Check if session has expired
  if (new Date() > session.expiresAt) {
    sessions.delete(shareCode)
    return null
  }
  
  return session
}

export function incrementDownloadCount(shareCode: string): boolean {
  const session = sessions.get(shareCode)
  
  if (!session) return false
  
  if (session.downloadCount >= session.maxDownloads) {
    return false
  }
  
  session.downloadCount++
  return true
}

export function deleteSession(shareCode: string): boolean {
  return sessions.delete(shareCode)
}

// Cleanup expired sessions every hour
setInterval(() => {
  const now = new Date()
  for (const [code, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(code)
    }
  }
}, 60 * 60 * 1000)