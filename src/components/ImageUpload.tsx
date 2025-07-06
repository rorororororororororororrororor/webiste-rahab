import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove: () => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  accept?: string;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  onImageRemove,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8,
  accept = "image/*",
  placeholder = "Click to upload image",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
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
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      // Resize image
      const resizedFile = await resizeImage(file);
      
      // Convert to base64 for immediate display and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageChange(base64);
        setIsUploading(false);
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageRemove();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors
          ${dragOver ? 'border-royal-blue bg-royal-blue/5' : 'border-gray-300 hover:border-royal-blue'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-blue mb-2"></div>
                <p className="text-gray-600 font-inter">Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  {dragOver ? <Upload className="w-6 h-6 text-royal-blue" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <p className="text-gray-600 font-inter mb-1">{placeholder}</p>
                <p className="text-sm text-gray-400 font-inter">
                  Drag & drop or click to browse
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;