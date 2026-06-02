export async function uploadToCloudinary(
  file: File | Buffer
): Promise<string> {
  // TODO: Implement Cloudinary upload logic
  // For now, return a placeholder URL
  // In production, use:
  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  // const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
  //   method: 'POST',
  //   body: formData
  // })
  // const data = await response.json()
  // return data.secure_url

  const fileName = file instanceof File ? file.name : 'upload'
  return `/uploads/${Date.now()}-${fileName}`
}
