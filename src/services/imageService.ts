import { supabaseAdmin } from '../lib/supabase';

export class ImageService {
  // Upload image to Supabase Storage
  static async uploadImage(file: File, bucket: string, folder: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  // Delete image from Supabase Storage
  static async deleteImage(url: string, bucket: string): Promise<void> {
    try {
      // Extract filename from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const fullPath = `${folder}/${fileName}`;

      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([fullPath]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw error;
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
}