import { NextRequest, NextResponse } from 'next/server'
import { generateShareCode, generateFileId } from '@/lib/crypto'
import { createSession } from '@/lib/session'
import { checkUploadRateLimit } from '@/lib/rate-limit'
import fs from 'fs'
import path from 'path'

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    if (!checkUploadRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const senderName = formData.get('senderName') as string
    const files = formData.getAll('files') as File[]

    if (!senderName?.trim() || files.length === 0) {
      return NextResponse.json(
        { error: 'Sender name and files are required' },
        { status: 400 }
      )
    }

    // Validate sender name
    if (senderName.length > 50) {
      return NextResponse.json(
        { error: 'Sender name must be 50 characters or less' },
        { status: 400 }
      )
    }

    // Validate files
    const maxFileSize = 100 * 1024 * 1024 // 100MB
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        console.warn(`File ${file.name} exceeds size limit`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: 'No valid files found (max 100MB per file)' },
        { status: 400 }
      )
    }

    const shareCode = generateShareCode()
    const fileUploads = []

    // Process each file
    for (const file of validFiles) {
      const fileId = generateFileId()
      const fileExtension = path.extname(file.name)
      const encryptedFileName = `${fileId}${fileExtension}`
      const filePath = path.join(uploadsDir, encryptedFileName)

      // Save file to disk (in production, use cloud storage)
      const buffer = Buffer.from(await file.arrayBuffer())
      fs.writeFileSync(filePath, buffer)

      fileUploads.push({
        id: fileId,
        originalName: file.name,
        encryptedName: encryptedFileName,
        size: file.size,
        encryptedSize: buffer.length
      })
    }

    // Create session
    const session = createSession(shareCode, senderName.trim(), fileUploads)

    return NextResponse.json({
      shareCode: session.shareCode,
      expiresAt: session.expiresAt,
      fileCount: session.files.length
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}