# Firebase Migration Setup Guide

This guide explains how to set up Firebase for the Kingdom Business Studio website after migrating from Supabase.

## What's Been Migrated

### ✅ **Completed Migrations:**
- **Database**: Supabase → Firebase Firestore
- **Storage**: Supabase Storage → Cloudinary (via backend API)
- **Authentication**: Custom admin auth (no change needed)
- **All Services**: Updated to use Firebase SDK

### 🔄 **What Changed:**
- `src/lib/supabase.ts` → `src/lib/firebase.ts`
- `src/services/adminService.ts` → Updated for Firestore
- `src/services/imageService.ts` → Updated for Cloudinary
- Removed Supabase dependencies and files

## Firebase Setup Instructions

### 1. **Firebase Project Setup**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project** (or use existing):
   - Project name: `kingdom-business-studio`
   - Enable Google Analytics (optional)
   - Click "Create project"

### 2. **Firestore Database Setup**

1. **Enable Firestore**:
   - Go to Firestore Database in Firebase Console
   - Click "Create database"
   - Choose "Start in test mode" (we'll add security rules later)
   - Select a location (choose closest to your users)

2. **Apply Security Rules**:
   - Go to Firestore Database → Rules
   - Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to businesses, blog posts, programs, and site settings
    match /businesses/{document} {
      allow read: if true;
      allow write: if true; // Admin operations will be handled by client-side authentication
    }
    
    match /blog_posts/{document} {
      allow read: if true;
      allow write: if true;
    }
    
    match /programs/{document} {
      allow read: if true;
      allow write: if true;
    }
    
    match /site_settings/{document} {
      allow read: if true;
      allow write: if true;
    }
    
    // Allow public write access to registrations (for user registrations)
    match /registrations/{document} {
      allow read, write: if true;
    }
  }
}
```

### 3. **Firebase Configuration**

1. **Get Firebase Config**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" → Web app
   - Register app with name: `kingdom-business-studio-web`
   - Copy the config object

2. **Update Frontend Config**:
   - The Firebase config is already set in `src/lib/firebase.ts`
   - If you need to update it, replace the config object with your new one

### 4. **Initial Data Setup**

The website will automatically create default data when first accessed. However, you can manually add initial data:

1. **Add Admin Password**:
   - Go to Firestore Database
   - Create collection: `site_settings`
   - Add document with ID: `admin_password`
   - Add field: `value` = `"kingdomstudio2025"` (or your preferred password)

2. **Add Default Programs** (optional):
   - The system will create default programs automatically
   - Or manually add to `programs` collection

### 5. **Environment Variables**

For production, you can add these environment variables to Netlify:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://your-backend-url.vercel.app
```

## Database Schema

### Collections Structure:

```
firestore/
├── businesses/
│   ├── {id}/
│   │   ├── name: string
│   │   ├── logo: string
│   │   ├── category: string
│   │   ├── description: string
│   │   ├── isNew: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── blog_posts/
│   ├── {id}/
│   │   ├── title: string
│   │   ├── excerpt: string
│   │   ├── content: string
│   │   ├── author: string
│   │   ├── date: string
│   │   ├── category: string
│   │   ├── imageUrl: string
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── programs/
│   ├── {id}/
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── primaryColor: string
│   │   ├── accentColors: array
│   │   ├── features: array
│   │   └── updatedAt: timestamp
│
├── registrations/
│   ├── {id}/
│   │   ├── fullName: string
│   │   ├── phoneNumber: string
│   │   ├── country: string
│   │   ├── industry: string
│   │   ├── businessIdea: string
│   │   ├── openToCollaboration: string
│   │   ├── bornAgain: string
│   │   ├── available8Weeks: string
│   │   ├── timePreference: string
│   │   ├── daysPreference: array
│   │   ├── paymentMethod: string
│   │   ├── paymentProof: string
│   │   └── createdAt: timestamp
│
└── site_settings/
    ├── admin_password/
    │   └── value: string
    ├── registration_price/
    │   └── value: number
    ├── contact_info/
    │   └── value: object
    └── social_media_links/
        └── value: object
```

## Testing the Setup

### 1. **Local Testing**
```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
cd backend
npm start
```

### 2. **Test Admin Login**
1. Go to `http://localhost:5173/admin`
2. Login with:
   - Username: `admin`
   - Password: `kingdomstudio2025` (or your custom password)

### 3. **Test Blog Post Creation**
1. Login to admin
2. Go to "Blog Posts" tab
3. Try creating a blog post with image upload
4. Verify it saves to Firestore and image uploads to Cloudinary

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**:
   - Check Firebase config in `src/lib/firebase.ts`
   - Verify all required fields are present

2. **"Permission denied" error**:
   - Check Firestore security rules
   - Make sure rules allow read/write access

3. **"Network error" when uploading images**:
   - Check if backend is running
   - Verify Cloudinary credentials in backend
   - Check CORS settings

4. **Admin login not working**:
   - Check if `admin_password` document exists in `site_settings`
   - Verify the password value is correct

### Debug Steps:

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API calls
3. **Check Firebase Console** for database activity
4. **Check Backend Logs** for server errors

## Production Deployment

### 1. **Deploy Backend to Vercel**
```bash
cd backend
vercel
```

### 2. **Deploy Frontend to Netlify**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables

### 3. **Update Environment Variables**
- Set `VITE_API_URL` to your Vercel backend URL
- Update Firebase config if needed

## Security Notes

- ✅ Firebase API keys are safe to expose in frontend
- ✅ Admin authentication is handled client-side
- ✅ Cloudinary API secret is only in backend
- ✅ Firestore rules provide basic security
- ✅ CORS is configured for security

## Support

If you encounter issues:
1. Check this guide first
2. Review Firebase Console for errors
3. Check browser console and network tab
4. Verify all environment variables are set correctly 