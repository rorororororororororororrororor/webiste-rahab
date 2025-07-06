import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, BlogPost, Program } from '../types';
import { AdminService } from '../services/adminService';

interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  location: string;
}

interface SocialMediaLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  businesses: Business[];
  blogPosts: BlogPost[];
  programs: Program[];
  registrations: any[];
  registrationPrice: number;
  contactInfo: ContactInfo;
  socialMediaLinks: SocialMediaLinks;
  adminPassword: string;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addBusiness: (business: Omit<Business, 'id'>) => Promise<void>;
  removeBusiness: (id: string) => Promise<void>;
  updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  removeBlogPost: (id: string) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<void>;
  addRegistration: (registration: any) => Promise<void>;
  getRegistrations: () => any[];
  removeRegistration: (id: string) => Promise<void>;
  updateRegistrationPrice: (price: number) => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updateSocialMediaLinks: (links: SocialMediaLinks) => Promise<void>;
  updateAdminPassword: (newPassword: string) => Promise<void>;
  sendContactMessage: (message: { name: string; email: string; message: string }) => void;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [registrationPrice, setRegistrationPrice] = useState(3000);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '+254 700 123 456',
    email: 'info@kingdombusinessstudio.com',
    whatsapp: '+254700123456',
    location: 'Nairobi, Kenya',
  });
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>({
    facebook: 'https://facebook.com/kingdombusinessstudio',
    instagram: 'https://instagram.com/kingdombusinessstudio',
    twitter: 'https://twitter.com/kingdombusiness',
    linkedin: 'https://linkedin.com/company/kingdom-business-studio',
  });
  const [adminPassword, setAdminPassword] = useState('kingdomstudio2025');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading all data...');
      
      // Load all data in parallel with error handling
      const [
        businessesData,
        blogPostsData,
        programsData,
        priceData,
        contactData,
        socialData
      ] = await Promise.allSettled([
        AdminService.getBusinesses(),
        AdminService.getBlogPosts(),
        AdminService.getPrograms(),
        AdminService.getRegistrationPrice(),
        AdminService.getContactInfo(),
        AdminService.getSocialMediaLinks()
      ]);

      // Handle results with fallbacks
      const newBusinesses = businessesData.status === 'fulfilled' ? businessesData.value : [];
      const newBlogPosts = blogPostsData.status === 'fulfilled' ? blogPostsData.value : [];
      const newPrograms = programsData.status === 'fulfilled' ? programsData.value : [];
      const newPrice = priceData.status === 'fulfilled' ? priceData.value : 3000;
      const newContactInfo = contactData.status === 'fulfilled' ? contactData.value : {
        phone: '+254 700 123 456',
        email: 'info@kingdombusinessstudio.com',
        whatsapp: '+254700123456',
        location: 'Nairobi, Kenya',
      };
      const newSocialLinks = socialData.status === 'fulfilled' ? socialData.value : {
        facebook: 'https://facebook.com/kingdombusinessstudio',
        instagram: 'https://instagram.com/kingdombusinessstudio',
        twitter: 'https://twitter.com/kingdombusiness',
        linkedin: 'https://linkedin.com/company/kingdom-business-studio',
      };

      console.log('Data loaded:', {
        businesses: newBusinesses.length,
        blogPosts: newBlogPosts.length,
        programs: newPrograms.length,
        price: newPrice,
        contactInfo: newContactInfo,
        socialLinks: newSocialLinks
      });

      setBusinesses(newBusinesses);
      setBlogPosts(newBlogPosts);
      setPrograms(newPrograms);
      setRegistrationPrice(newPrice);
      setContactInfo(newContactInfo);
      setSocialMediaLinks(newSocialLinks);

      // Load registrations only if authenticated
      if (AdminService.isAdminAuthenticated()) {
        try {
          const registrationsData = await AdminService.getRegistrations();
          setRegistrations(registrationsData);
          console.log('Registrations loaded:', registrationsData.length);
        } catch (error) {
          console.error('Error loading registrations:', error);
          setRegistrations([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set default values on error
      setBusinesses([]);
      setBlogPosts([]);
      setPrograms([]);
      setRegistrationPrice(3000);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('Refreshing data...');
    await loadData();
  };

  useEffect(() => {
    loadData();
    
    // Check if user was previously authenticated
    const authStatus = localStorage.getItem('kbs-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login...');
      const success = await AdminService.login(username, password);
      if (success) {
        setIsAuthenticated(true);
        localStorage.setItem('kbs-admin-auth', 'true');
        // Refresh data after login to load registrations
        await refreshData();
        console.log('Login successful, data refreshed');
        return true;
      }
      console.log('Login failed');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kbs-admin-auth');
    localStorage.removeItem('kbs-admin-session');
    setRegistrations([]); // Clear registrations on logout
  };

  const addBusiness = async (business: Omit<Business, 'id'>) => {
    try {
      console.log('Adding business via context...');
      await AdminService.addBusiness(business);
      await refreshData();
      console.log('Business added and data refreshed');
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  };

  const removeBusiness = async (id: string) => {
    try {
      console.log('Removing business via context...');
      await AdminService.removeBusiness(id);
      await refreshData();
      console.log('Business removed and data refreshed');
    } catch (error) {
      console.error('Error removing business:', error);
      throw error;
    }
  };

  const updateBusiness = async (id: string, business: Partial<Business>) => {
    try {
      console.log('Updating business via context...');
      await AdminService.updateBusiness(id, business);
      await refreshData();
      console.log('Business updated and data refreshed');
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      console.log('Adding blog post via context...');
      await AdminService.addBlogPost(post);
      await refreshData();
      console.log('Blog post added and data refreshed');
    } catch (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }
  };

  const removeBlogPost = async (id: string) => {
    try {
      console.log('Removing blog post via context...');
      await AdminService.removeBlogPost(id);
      await refreshData();
      console.log('Blog post removed and data refreshed');
    } catch (error) {
      console.error('Error removing blog post:', error);
      throw error;
    }
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    try {
      console.log('Updating blog post via context...');
      await AdminService.updateBlogPost(id, post);
      await refreshData();
      console.log('Blog post updated and data refreshed');
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  };

  const updateProgram = async (id: string, program: Partial<Program>) => {
    try {
      console.log('Updating program via context...');
      await AdminService.updateProgram(id, program);
      await refreshData();
      console.log('Program updated and data refreshed');
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  };

  const addRegistration = async (registration: any) => {
    try {
      console.log('Adding registration via context...');
      await AdminService.addRegistration(registration);
      // Only refresh if admin is authenticated to see registrations
      if (isAuthenticated) {
        await refreshData();
        console.log('Registration added and data refreshed');
      }
    } catch (error) {
      console.error('Error adding registration:', error);
      throw error;
    }
  };

  const getRegistrations = () => registrations;

  const removeRegistration = async (id: string) => {
    try {
      console.log('Removing registration via context...');
      await AdminService.removeRegistration(id);
      await refreshData();
      console.log('Registration removed and data refreshed');
    } catch (error) {
      console.error('Error removing registration:', error);
      throw error;
    }
  };

  const updateRegistrationPrice = async (price: number) => {
    try {
      console.log('Updating registration price via context...');
      await AdminService.updateRegistrationPrice(price);
      await refreshData();
      console.log('Registration price updated and data refreshed');
    } catch (error) {
      console.error('Error updating registration price:', error);
      throw error;
    }
  };

  const updateContactInfo = async (info: ContactInfo) => {
    try {
      console.log('Updating contact info via context...');
      await AdminService.updateContactInfo(info);
      await refreshData();
      console.log('Contact info updated and data refreshed');
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };

  const updateSocialMediaLinks = async (links: SocialMediaLinks) => {
    try {
      console.log('Updating social media links via context...');
      await AdminService.updateSocialMediaLinks(links);
      await refreshData();
      console.log('Social media links updated and data refreshed');
    } catch (error) {
      console.error('Error updating social media links:', error);
      throw error;
    }
  };

  const updateAdminPassword = async (newPassword: string) => {
    try {
      console.log('Updating admin password via context...');
      await AdminService.updateAdminPassword(newPassword);
      setAdminPassword(newPassword);
      console.log('Admin password updated');
    } catch (error) {
      console.error('Error updating admin password:', error);
      throw error;
    }
  };

  const sendContactMessage = (message: { name: string; email: string; message: string }) => {
    // Create mailto link with the admin's email
    const subject = encodeURIComponent(`Contact Form Message from ${message.name}`);
    const body = encodeURIComponent(`
Name: ${message.name}
Email: ${message.email}

Message:
${message.message}

---
Sent from Kingdom Business Studio Contact Form
    `);
    
    const mailtoLink = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        businesses,
        blogPosts,
        programs,
        registrations,
        registrationPrice,
        contactInfo,
        socialMediaLinks,
        adminPassword,
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
        addRegistration,
        getRegistrations,
        removeRegistration,
        updateRegistrationPrice,
        updateContactInfo,
        updateSocialMediaLinks,
        updateAdminPassword,
        sendContactMessage,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};