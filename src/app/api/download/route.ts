import { NextRequest, NextResponse } from 'next/server'
import { getSession, incrementDownloadCount, deleteSession } from '@/lib/session'
import { checkDownloadRateLimit } from '@/lib/rate-limit'
import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'

const uploadsDir = path.join(process.cwd(), 'uploads')

export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    if (!checkDownloadRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many downloads. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const shareCode = searchParams.get('code')

    if (!shareCode?.trim()) {
      return NextResponse.json(
        { error: 'Share code is required' },
        { status: 400 }
      )
    }

    const session = getSession(shareCode.trim())

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid share code or files have expired' },
        { status: 404 }
      )
    }

    // Check download limits
    if (!incrementDownloadCount(shareCode)) {
      return NextResponse.json(
        { error: 'Download limit exceeded' },
        { status: 429 }
      )
    }

    // Create ZIP file
    const zip = new JSZip()

    // Add all files to ZIP
    for (const file of session.files) {
      const filePath = path.join(uploadsDir, file.encryptedName)
      
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath)
        zip.file(file.originalName, fileData)
      }
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Clean up session if all downloads are used
    if (session.downloadCount >= session.maxDownloads - 1) {
      // Delete files from disk
      for (const file of session.files) {
        const filePath = path.join(uploadsDir, file.encryptedName)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
      deleteSession(shareCode)
    }

    // Return ZIP file
    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="files-${shareCode}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}