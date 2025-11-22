import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
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

    // Return session info without sensitive data
    return NextResponse.json({
      senderName: session.senderName,
      files: session.files.map(file => ({
        name: file.originalName,
        size: file.size
      })),
      totalSize: session.files.reduce((sum, file) => sum + file.size, 0),
      expiresAt: session.expiresAt,
      downloadCount: session.downloadCount,
      maxDownloads: session.maxDownloads
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}