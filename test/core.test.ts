import { generateShareCode, encrypt, decrypt } from '../src/lib/crypto'
import { createSession, getSession } from '../src/lib/session'

describe('PrivoSend Core Functions', () => {
  describe('Share Code Generation', () => {
    test('should generate valid share codes', () => {
      const code = generateShareCode()
      expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
      expect(code.length).toBe(9)
    })

    test('should generate unique codes', () => {
      const codes = new Set()
      for (let i = 0; i < 100; i++) {
        codes.add(generateShareCode())
      }
      expect(codes.size).toBe(100)
    })
  })

  describe('Encryption', () => {
    test('should encrypt and decrypt text correctly', () => {
      const originalText = 'Hello, World!'
      const encrypted = encrypt(originalText)
      const decrypted = decrypt(encrypted)
      expect(decrypted).toBe(originalText)
    })

    test('should produce different encrypted outputs for same input', () => {
      const text = 'Test message'
      const encrypted1 = encrypt(text)
      const encrypted2 = encrypt(text)
      expect(encrypted1).not.toBe(encrypted2)
    })
  })

  describe('Session Management', () => {
    test('should create and retrieve sessions', () => {
      const shareCode = generateShareCode()
      const senderName = 'Test User'
      const files = [
        {
          id: 'test1',
          originalName: 'test.pdf',
          encryptedName: 'encrypted1.pdf',
          size: 1024,
          encryptedSize: 1024
        }
      ]

      const session = createSession(shareCode, senderName, files)
      expect(session.shareCode).toBe(shareCode)
      expect(session.senderName).toBe(senderName)
      expect(session.files).toHaveLength(1)

      const retrievedSession = getSession(shareCode)
      expect(retrievedSession).toEqual(session)
    })

    test('should return null for invalid share codes', () => {
      const session = getSession('INVALID-CODE')
      expect(session).toBeNull()
    })
  })
})