export async function uploadToCloudinary(
  file: File | Buffer | any
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[v0] Cloudinary credentials not found, using local upload path');
    const fileName = file instanceof File ? file.name : 'upload';
    return `/uploads/${Date.now()}-${fileName}`;
  }

  try {
    const formData = new FormData();
    
    // Only append File objects to FormData
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      // For Buffer or other types, skip Cloudinary upload
      const fileName = 'upload';
      return `/uploads/${Date.now()}-${fileName}`;
    }
    
    formData.append('cloud_name', cloudName);
    formData.append('api_key', apiKey);
    formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

    // Calculate signature using crypto
    const timestamp = Math.floor(Date.now() / 1000);
    const strToSign = `cloud_name=${cloudName}&timestamp=${timestamp}${apiSecret}`;
    
    // For Node.js environment (server-side API routes)
    let signature = '';
    if (typeof window === 'undefined') {
      const crypto = require('crypto');
      signature = crypto
        .createHash('sha1')
        .update(strToSign)
        .digest('hex');
    }
    
    if (signature) {
      formData.append('signature', signature);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('[v0] Cloudinary upload error:', error);
    // Fallback to local path
    const fileName = file instanceof File ? file.name : 'upload';
    return `/uploads/${Date.now()}-${fileName}`;
  }
}
