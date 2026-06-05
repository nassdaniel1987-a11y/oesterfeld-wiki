import { createSign } from "node:crypto"

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const DRIVE_UPLOAD_URL =
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink"
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"])

type UploadResponse = {
  id: string
  name: string
  webViewLink?: string
  webContentLink?: string
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })

const getEnv = (name: string) => {
  const netlifyEnv = (globalThis as { Netlify?: { env?: { get?: (key: string) => string | undefined } } })
    .Netlify
  return netlifyEnv?.env?.get?.(name) ?? process.env[name]
}

const base64Url = (value: string | Buffer) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

const getPrivateKey = () => getEnv("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n")

const createJwt = (clientEmail: string, privateKey: string) => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: DRIVE_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  )
  const unsignedToken = `${header}.${claim}`
  const signature = createSign("RSA-SHA256").update(unsignedToken).sign(privateKey)
  return `${unsignedToken}.${base64Url(signature)}`
}

const getAccessToken = async (clientEmail: string, privateKey: string) => {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwt(clientEmail, privateKey),
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Google token request failed: ${response.status} ${details}`)
  }

  const token = (await response.json()) as { access_token?: string }
  if (!token.access_token) {
    throw new Error("Google token response did not include an access token")
  }

  return token.access_token
}

const hasAllowedExtension = (name: string) => {
  const lowerName = name.toLowerCase()
  return [...ALLOWED_EXTENSIONS].some((extension) => lowerName.endsWith(extension))
}

const isAllowedFile = (file: File) =>
  ALLOWED_MIME_TYPES.has(file.type) || (file.type === "" && hasAllowedExtension(file.name))

const uploadToDrive = async (file: File, accessToken: string, folderId: string) => {
  const boundary = `gts-wiki-${crypto.randomUUID()}`
  const metadata = {
    name: file.name,
    parents: [folderId],
  }
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
        metadata,
      )}\r\n`,
    ),
    Buffer.from(`--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`),
    fileBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ])

  const response = await fetch(DRIVE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body,
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Google Drive upload failed: ${response.status} ${details}`)
  }

  return (await response.json()) as UploadResponse
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL")
  const privateKey = getPrivateKey()
  const folderId = getEnv("GOOGLE_DRIVE_FOLDER_ID")

  if (!clientEmail || !privateKey || !folderId) {
    return json({ error: "Drive upload is not configured" }, 500)
  }

  const formData = await req.formData()
  const attachment = formData.get("attachment")

  if (!(attachment instanceof File) || attachment.size === 0) {
    return json({ error: "No file received" }, 400)
  }

  if (attachment.size > MAX_UPLOAD_BYTES) {
    return json({ error: "File is too large. Please upload a file up to 5 MB." }, 413)
  }

  if (!isAllowedFile(attachment)) {
    return json({ error: "Only PDF, DOC, and DOCX files are allowed." }, 400)
  }

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey)
    const uploadedFile = await uploadToDrive(attachment, accessToken, folderId)

    return json({
      id: uploadedFile.id,
      name: uploadedFile.name,
      url: uploadedFile.webViewLink ?? uploadedFile.webContentLink,
    })
  } catch (error) {
    console.error(error)
    return json({ error: "Upload failed" }, 500)
  }
}

export const config = {
  path: "/api/upload-to-drive",
}
