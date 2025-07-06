# Kingdom Business Studio

A modern business website built with React, Firebase, and Cloudinary for secure content management and image handling.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Content Management**: Admin panel for managing businesses, blog posts, and programs
- **Secure Image Upload**: Cloudinary integration for optimized image storage
- **Real-time Database**: Firebase Firestore for data storage
- **User Registration**: Program registration system
- **Mobile Responsive**: Works perfectly across all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Cloudinary SDK
- **Database**: Firebase Firestore
- **Image Storage**: Cloudinary
- **Deployment**: Netlify (Frontend), Vercel (Backend)

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── context/            # React context
│   ├── types/              # TypeScript types
│   └── lib/                # Firebase configuration
├── backend/                # Express API server
├── dist/                   # Build output
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Cloudinary account

### 1. Clone and Install
```bash
git clone <repository-url>
cd webiste-rahab
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Variables
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:3001
```

Create `config.env` in backend:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

### 4. Start Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start
```

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete Firebase configuration
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md) - Image upload integration
- [Firestore Rules](./firestore.rules) - Database security rules
- [Storage Rules](./storage.rules) - Firebase Storage rules

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Firestore Database
3. Apply security rules from `firestore.rules`
4. Update Firebase config in `src/lib/firebase.ts`

### Cloudinary Setup
1. Create Cloudinary account
2. Get API credentials
3. Update backend environment variables
4. Test image upload functionality

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Backend (Vercel)
```bash
cd backend
vercel
```

## 🔐 Admin Access

- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `kingdomstudio2025` (change in Firebase)

## 📱 Features

### Public Pages
- **Home**: Landing page with hero section
- **Blog**: Blog posts with search and filtering
- **Contact**: Contact form and information
- **Register**: Program registration form

### Admin Panel
- **Businesses**: Add/edit/delete business listings
- **Blog Posts**: Create and manage blog content
- **Programs**: Manage program information
- **Registrations**: View user registrations
- **Settings**: Site configuration

## 🛡️ Security

- ✅ Firebase security rules implemented
- ✅ Admin authentication system
- ✅ Secure image upload with validation
- ✅ CORS configured for production
- ✅ Environment variables for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation files
- Review Firebase Console for errors
- Check browser console for frontend issues
- Verify environment variables are set correctly
