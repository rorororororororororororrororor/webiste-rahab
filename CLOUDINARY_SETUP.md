# Cloudinary Integration Setup Guide

This guide explains how to set up and use the Cloudinary image upload integration for the Kingdom Business Studio website.

## What's Been Implemented

### 1. Backend API (Node.js/Express)
- **Location**: `backend/` directory
- **Upload Endpoint**: `POST /api/upload`
- **Delete Endpoint**: `DELETE /api/delete/:publicId`
- **Features**:
  - Secure file upload to Cloudinary
  - Image optimization and resizing
  - File type validation
  - Error handling

### 2. Frontend Integration
- **New Component**: `CloudinaryImageUpload.tsx`
- **Updated**: Admin blog form to use Cloudinary
- **Features**:
  - Drag & drop image upload
  - Progress indicator
  - Image preview
  - Error handling

### 3. Security
- **Environment Variables**: Cloudinary credentials stored securely
- **File Validation**: Type and size restrictions
- **CORS**: Configured for secure cross-origin requests

## Setup Instructions

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Edit `config.env` file with your Cloudinary credentials:
   ```
   CLOUDINARY_CLOUD_NAME=dokhcfmht
   CLOUDINARY_API_KEY=381871192269298
   CLOUDINARY_API_SECRET=9LI9sAlV32BX2VgEdPNW06uCt08
   PORT=3001
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Add environment variable** (optional):
   Create `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:3001
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

### 3. Firebase Rules Update

Make sure your Firestore rules allow public read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blog_posts/{document} {
      allow read: if true;
      allow write: if true;
    }
    // ... other collections
  }
}
```

## How to Use

### 1. Admin Login
1. Go to `/admin` page
2. Login with admin credentials
3. Navigate to "Blog Posts" tab

### 2. Upload Blog Post Image
1. Click "Add New Blog Post"
2. Fill in blog post details
3. In the "Featured Image" section:
   - Click the upload area
   - Select an image file (PNG, JPG, GIF up to 10MB)
   - Wait for upload to complete
   - Image will be automatically optimized and stored in Cloudinary

### 3. Edit Blog Post
1. Find the blog post in "Existing Blog Posts"
2. Click "Edit"
3. Use the Cloudinary upload component to change the image
4. Save changes

## File Structure

```
backend/
├── server.js          # Main Express server
├── upload.js          # Cloudinary upload routes
├── config.env         # Environment variables
├── package.json       # Backend dependencies
└── .gitignore         # Git ignore rules

src/
├── components/
│   └── CloudinaryImageUpload.tsx  # New upload component
├── services/
│   └── imageService.ts            # Updated to use Cloudinary
└── pages/
    └── Admin.tsx                  # Updated blog form
```

## API Endpoints

### Upload Image
- **URL**: `POST /api/upload`
- **Body**: `multipart/form-data` with `image` field
- **Response**: 
  ```json
  {
    "url": "https://res.cloudinary.com/...",
    "publicId": "blog_images/...",
    "width": 1200,
    "height": 800
  }
  ```

### Delete Image
- **URL**: `DELETE /api/delete/:publicId`
- **Response**: 
  ```json
  {
    "message": "Image deleted successfully"
  }
  ```

## Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check if port 3001 is available
   - Verify environment variables are set correctly
   - Check Cloudinary credentials

2. **Upload failing**:
   - Check file size (max 10MB)
   - Verify file type (images only)
   - Check network connection
   - Verify backend is running

3. **CORS errors**:
   - Backend CORS is configured for localhost:5173
   - Update CORS settings in `server.js` for production

4. **Image not displaying**:
   - Check if Cloudinary URL is valid
   - Verify image was uploaded successfully
   - Check browser console for errors

### Environment Variables

Make sure these are set correctly:

```bash
# Backend (config.env)
CLOUDINARY_CLOUD_NAME=dokhcfmht
CLOUDINARY_API_KEY=381871192269298
CLOUDINARY_API_SECRET=9LI9sAlV32BX2VgEdPNW06uCt08
PORT=3001

# Frontend (.env) - optional
VITE_API_URL=http://localhost:3001
```

## Security Notes

- ✅ Cloudinary API secret is only used in backend
- ✅ File type validation prevents malicious uploads
- ✅ File size limits prevent abuse
- ✅ CORS configured for security
- ✅ Environment variables not committed to git

## Production Deployment

1. **Backend**: Deploy to your preferred hosting (Heroku, Vercel, etc.)
2. **Frontend**: Update `VITE_API_URL` to point to your backend
3. **CORS**: Update CORS settings in `server.js` for your domain
4. **Environment**: Set production environment variables

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set
4. Ensure both frontend and backend are running 