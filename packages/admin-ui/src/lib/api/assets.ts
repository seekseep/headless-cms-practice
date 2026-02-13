import client from './client'

type CreateUploadUrlInput = {
  contentType: string
}

type CreateUploadUrlResponse = {
  uploadUrl: string
  url: string
}

export async function createUploadUrl(
  input: CreateUploadUrlInput,
): Promise<CreateUploadUrlResponse> {
  const res = await client.post('/assets/upload-url', input)
  return res.data
}
