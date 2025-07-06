import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Eye, 
  EyeOff, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Users, 
  FileText, 
  Briefcase, 
  Settings,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Business, BlogPost, Program } from '../types';
import ImageUpload from '../components/ImageUpload';

const Admin: React.FC = () => {
  const {
    isAuthenticated,
    businesses,
    blogPosts,
    programs,
    registrations,
    registrationPrice,
    contactInfo,
    socialMediaLinks,
    loading,
    login,
    logout,
    addBusiness,
    removeBusiness,
    updateBusiness,
    addBlogPost,
    removeBlogPost,
    updateBlogPost,
    updateProgram,
    removeRegistration,
    updateRegistrationPrice,
    updateContactInfo,
    updateSocialMediaLinks,
    updateAdminPassword,
  } = useAdmin();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('businesses');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newBusiness, setNewBusiness] = useState<Omit<Business, 'id'>>({
    name: '',
    logo: '',
    category: '',
    description: '',
    isNew: false,
  });
  const [newBlogPost, setNewBlogPost] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    imageUrl: '',
  });
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    registrationPrice: registrationPrice,
    contactInfo: contactInfo,
    socialMediaLinks: socialMediaLinks,
    newPassword: '',
  });

  useEffect(() => {
    setSettingsForm(prev => ({
      ...prev,
      registrationPrice,
      contactInfo,
      socialMediaLinks,
    }));
  }, [registrationPrice, contactInfo, socialMediaLinks]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const success = await login(loginForm.username, loginForm.password);
      if (!success) {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAddBusiness = async () => {
    if (!newBusiness.name || !newBusiness.category || !newBusiness.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await addBusiness(newBusiness);
      setNewBusiness({ name: '', logo: '', category: '', description: '', isNew: false });
      alert('Business added successfully!');
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Failed to add business. Please try again.');
    }
  };

  const handleUpdateBusiness = async () => {
    if (!editingBusiness) return;
    try {
      await updateBusiness(editingBusiness.id, editingBusiness);
      setEditingBusiness(null);
      setEditingItem(null);
      alert('Business updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Failed to update business. Please try again.');
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await removeBusiness(id);
        alert('Business deleted successfully!');
      } catch (error) {
        console.error('Error deleting business:', error);
        alert('Failed to delete business. Please try again.');
      }
    }
  };

  const handleAddBlogPost = async () => {
    if (!newBlogPost.title || !newBlogPost.excerpt || !newBlogPost.content || !newBlogPost.author || !newBlogPost.category) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await addBlogPost(newBlogPost);
      setNewBlogPost({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        imageUrl: '',
      });
      alert('Blog post added successfully!');
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert('Failed to add blog post. Please try again.');
    }
  };

  const handleUpdateBlogPost = async () => {
    if (!editingBlogPost) return;
    try {
      await updateBlogPost(editingBlogPost.id, editingBlogPost);
      setEditingBlogPost(null);
      setEditingItem(null);
      alert('Blog post updated successfully!');
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Failed to update blog post. Please try again.');
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await removeBlogPost(id);
        alert('Blog post deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram) return;
    try {
      await updateProgram(editingProgram.id, editingProgram);
      setEditingProgram(null);
      setEditingItem(null);
      alert('Program updated successfully!');
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program. Please try again.');
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await removeRegistration(id);
        alert('Registration deleted successfully!');
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Failed to delete registration. Please try again.');
      }
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateRegistrationPrice(settingsForm.registrationPrice);
      await updateContactInfo(settingsForm.contactInfo);
      await updateSocialMediaLinks(settingsForm.socialMediaLinks);
      
      if (settingsForm.newPassword) {
        await updateAdminPassword(settingsForm.newPassword);
        setSettingsForm(prev => ({ ...prev, newPassword: '' }));
      }
      
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <Crown className="w-12 h-12 text-royal-blue mx-auto mb-4" />
            <h1 className="text-2xl font-playfair font-bold text-gray-900">Admin Login</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-royal-blue text-white py-3 rounded-lg font-inter font-semibold hover:bg-deep-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-royal-blue hover:text-deep-blue transition-colors font-inter text-sm"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-royal-blue" />
              <div>
                <h1 className="text-xl font-playfair font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 font-inter">Kingdom Business Studio</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-royal-blue transition-colors font-inter"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-inter font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'businesses', label: 'Businesses', icon: Briefcase },
              { id: 'blog', label: 'Blog Posts', icon: FileText },
              { id: 'programs', label: 'Programs', icon: Crown },
              { id: 'registrations', label: 'Registrations', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-inter font-medium transition-colors ${
                  activeTab === id
                    ? 'border-royal-blue text-royal-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Add New Business</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={newBusiness.name}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newBusiness.category}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <ImageUpload
                    currentImage={newBusiness.logo}
                    onImageChange={(imageUrl) => setNewBusiness(prev => ({ ...prev, logo: imageUrl }))}
                    onImageRemove={() => setNewBusiness(prev => ({ ...prev, logo: '' }))}
                    maxWidth={200}
                    maxHeight={200}
                    placeholder="Upload business logo"
                    className="max-w-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newBusiness.description}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter business description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={newBusiness.isNew}
                    onChange={(e) => setNewBusiness(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isNew" className="text-sm font-inter text-gray-700">
                    Mark as "New"
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleAddBusiness}
                  className="bg-royal-blue text-white px-6 py-3 rounded-lg font-inter font-semibold hover:bg-deep-blue transition-colors"
                >
                  Add Business
                </button>
              </div>
            </div>

            {/* Existing Businesses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Existing Businesses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                    {editingItem === business.id && editingBusiness ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingBusiness.name}
                          onChange={(e) => setEditingBusiness(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={editingBusiness.category}
                          onChange={(e) => setEditingBusiness(prev => prev ? { ...prev, category: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                        />
                        <ImageUpload
                          currentImage={editingBusiness.logo}
                          onImageChange={(imageUrl) => setEditingBusiness(prev => prev ? { ...prev, logo: imageUrl } : null)}
                          onImageRemove={() => setEditingBusiness(prev => prev ? { ...prev, logo: '' } : null)}
                          maxWidth={200}
                          maxHeight={200}
                          placeholder="Upload business logo"
                        />
                        <textarea
                          value={editingBusiness.description}
                          onChange={(e) => setEditingBusiness(prev => prev ? { ...prev, description: e.target.value } : null)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingBusiness.isNew}
                            onChange={(e) => setEditingBusiness(prev => prev ? { ...prev, isNew: e.target.checked } : null)}
                            className="mr-2"
                          />
                          <label className="text-sm font-inter text-gray-700">Mark as "New"</label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateBusiness}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setEditingBusiness(null);
                            }}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded border">
                            {business.logo.startsWith('data:') ? (
                              <img src={business.logo} alt={business.name} className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <span className="text-2xl">{business.logo || '🏢'}</span>
                            )}
                          </div>
                          {business.isNew && (
                            <span className="bg-mustard-yellow text-white px-2 py-1 rounded text-xs font-inter font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="font-playfair font-semibold text-gray-900 mb-1">{business.name}</h3>
                        <p className="text-royal-blue font-inter text-sm mb-2">{business.category}</p>
                        <p className="text-gray-600 font-inter text-sm mb-4">{business.description}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(business.id);
                              setEditingBusiness(business);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Add New Blog Post</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBlogPost.title}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                      placeholder="Enter blog post title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={newBlogPost.author}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={newBlogPost.category}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                      placeholder="e.g., Faith & Business"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newBlogPost.date}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    currentImage={newBlogPost.imageUrl}
                    onImageChange={(imageUrl) => setNewBlogPost(prev => ({ ...prev, imageUrl }))}
                    onImageRemove={() => setNewBlogPost(prev => ({ ...prev, imageUrl: '' }))}
                    maxWidth={800}
                    maxHeight={400}
                    placeholder="Upload blog post image"
                    className="max-w-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={newBlogPost.excerpt}
                    onChange={(e) => setNewBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter a brief excerpt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newBlogPost.content}
                    onChange={(e) => setNewBlogPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter the full blog post content"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleAddBlogPost}
                  className="bg-royal-blue text-white px-6 py-3 rounded-lg font-inter font-semibold hover:bg-deep-blue transition-colors"
                >
                  Add Blog Post
                </button>
              </div>
            </div>

            {/* Existing Blog Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Existing Blog Posts</h2>
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                    {editingItem === post.id && editingBlogPost ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingBlogPost.title}
                            onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={editingBlogPost.author}
                            onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, author: e.target.value } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                            placeholder="Author"
                          />
                          <input
                            type="text"
                            value={editingBlogPost.category}
                            onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, category: e.target.value } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                            placeholder="Category"
                          />
                          <input
                            type="date"
                            value={editingBlogPost.date}
                            onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, date: e.target.value } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                          />
                        </div>
                        <ImageUpload
                          currentImage={editingBlogPost.imageUrl}
                          onImageChange={(imageUrl) => setEditingBlogPost(prev => prev ? { ...prev, imageUrl } : null)}
                          onImageRemove={() => setEditingBlogPost(prev => prev ? { ...prev, imageUrl: '' } : null)}
                          maxWidth={800}
                          maxHeight={400}
                          placeholder="Upload blog post image"
                          className="max-w-md"
                        />
                        <textarea
                          value={editingBlogPost.excerpt}
                          onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                          placeholder="Excerpt"
                        />
                        <textarea
                          value={editingBlogPost.content}
                          onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, content: e.target.value } : null)}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                          placeholder="Content"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateBlogPost}
                            className="bg-green-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-green-600 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setEditingBlogPost(null);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">{post.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {post.author}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                              <span className="bg-royal-blue/10 text-royal-blue px-2 py-1 rounded text-xs">
                                {post.category}
                              </span>
                            </div>
                            <p className="text-gray-600 font-inter mb-3">{post.excerpt}</p>
                          </div>
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-24 h-16 object-cover rounded ml-4"
                            />
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(post.id);
                              setEditingBlogPost(post);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Programs</h2>
              <div className="space-y-6">
                {programs.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-6">
                    {editingItem === program.id && editingProgram ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingProgram.name}
                          onChange={(e) => setEditingProgram(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                          placeholder="Program Name"
                        />
                        <textarea
                          value={editingProgram.description}
                          onChange={(e) => setEditingProgram(prev => prev ? { ...prev, description: e.target.value } : null)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                          placeholder="Program Description"
                        />
                        <div>
                          <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                            Features (one per line)
                          </label>
                          <textarea
                            value={editingProgram.features.join('\n')}
                            onChange={(e) => setEditingProgram(prev => prev ? { 
                              ...prev, 
                              features: e.target.value.split('\n').filter(f => f.trim()) 
                            } : null)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                            placeholder="Enter features, one per line"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateProgram}
                            className="bg-green-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-green-600 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setEditingProgram(null);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">{program.name}</h3>
                            <p className="text-gray-600 font-inter mb-4">{program.description}</p>
                            <div className="space-y-1">
                              {program.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-gray-600 font-inter text-sm">
                                  <div className="w-2 h-2 bg-royal-blue rounded-full mr-3"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            program.primaryColor === 'royal-blue' ? 'bg-royal-blue text-white' : 'bg-mustard-yellow text-white'
                          }`}>
                            {program.primaryColor}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingItem(program.id);
                            setEditingProgram(program);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-blue-600 transition-colors"
                        >
                          Edit Program
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">
              Registrations ({registrations.length})
            </h2>
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-playfair font-semibold text-gray-900">{registration.fullName}</h3>
                      <p className="text-gray-600 font-inter text-sm flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        {registration.phoneNumber}
                      </p>
                      <p className="text-gray-600 font-inter text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {registration.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Industry:</strong> {registration.industry}
                      </p>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Payment:</strong> {registration.paymentMethod}
                      </p>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Proof:</strong> {registration.paymentProof}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Registered:</strong> {new Date(registration.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Time Preference:</strong> {registration.timePreference}
                      </p>
                      <p className="text-gray-600 font-inter text-sm">
                        <strong>Days:</strong> {registration.daysPreference.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-gray-700 font-inter text-sm">
                      <strong>Business Idea:</strong> {registration.businessIdea}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteRegistration(registration.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded font-inter font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {registrations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-inter">No registrations yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Registration Price */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Registration Price</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    value={settingsForm.registrationPrice}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, registrationPrice: parseInt(e.target.value) || 0 }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Price in KES"
                  />
                  <span className="ml-2 text-gray-600 font-inter">KES</span>
                </div>
                <button
                  onClick={handleUpdateSettings}
                  className="bg-royal-blue text-white px-4 py-2 rounded font-inter font-medium hover:bg-deep-blue transition-colors"
                >
                  Update Price
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactInfo.phone}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactInfo.email}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactInfo.whatsapp}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, whatsapp: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactInfo.location}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, location: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Social Media Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={settingsForm.socialMediaLinks.facebook}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      socialMediaLinks: { ...prev.socialMediaLinks, facebook: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={settingsForm.socialMediaLinks.instagram}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      socialMediaLinks: { ...prev.socialMediaLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={settingsForm.socialMediaLinks.twitter}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      socialMediaLinks: { ...prev.socialMediaLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={settingsForm.socialMediaLinks.linkedin}
                    onChange={(e) => setSettingsForm(prev => ({
                      ...prev,
                      socialMediaLinks: { ...prev.socialMediaLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Admin Password */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-playfair font-bold text-gray-900 mb-6">Change Admin Password</h2>
              <div className="max-w-md">
                <label className="block text-sm font-inter font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={settingsForm.newPassword}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Save All Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={handleUpdateSettings}
                className="bg-royal-blue text-white px-8 py-3 rounded-lg font-inter font-semibold hover:bg-deep-blue transition-colors"
              >
                Save All Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;