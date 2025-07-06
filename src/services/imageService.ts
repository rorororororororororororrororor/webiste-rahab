export class ImageService {
  private static API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend1-gnbtaodu2-rowans-projects-35c2db59.vercel.app';

  // Upload image to Cloudinary via backend API
  static async uploadImage(file: File, folder: string = 'blog_images'): Promise<string> {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Upload to backend
      const response = await fetch(`${this.API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete image from Cloudinary (optional)
  static async deleteImage(publicId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/delete/${publicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Resize and compress image before upload
  static resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Get optimized Cloudinary URL with transformations
  static getOptimizedUrl(url: string, width?: number, height?: number, quality: string = 'auto'): string {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    // Add Cloudinary transformations
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);

    if (transformations.length === 0) {
      return url;
    }

    // Insert transformations into the URL
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex !== -1) {
      urlParts.splice(uploadIndex + 1, 0, transformations.join(','));
      return urlParts.join('/');
    }

    return url;
  }
}