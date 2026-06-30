import { NextResponse } from 'next/server'
import { google } from 'googleapis'

function getDriveAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  if (!email || !key) throw new Error('Google credentials not configured')
  return new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })
}

export async function GET() {
  try {
    const auth = getDriveAuth()
    const drive = google.drive({ version: 'v3', auth })

    const sharedDrives = await drive.drives.list({ pageSize: 50 })
    const targetId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID

    let targetCheck: any = { tried: targetId, error: null }
    if (targetId) {
      try {
        const r = await drive.files.get({
          fileId: targetId,
          fields: 'id, name, mimeType, driveId, parents, owners',
          supportsAllDrives: true,
        })
        targetCheck.success = true
        targetCheck.file = r.data
      } catch (e) {
        targetCheck.error = e instanceof Error ? e.message : String(e)
      }
    } else {
      targetCheck.error = 'GOOGLE_DRIVE_PARENT_FOLDER_ID not set'
    }

    return NextResponse.json({
      serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      sharedDrives: sharedDrives.data.drives?.map((d) => ({ id: d.id, name: d.name })) || [],
      sharedDrivesCount: sharedDrives.data.drives?.length || 0,
      targetCheck,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
