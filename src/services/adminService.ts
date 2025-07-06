import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Business, BlogPost, Program } from '../types';

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

export class AdminService {
  // Authentication
  static async login(username: string, password: string): Promise<boolean> {
    try {
      console.log('Attempting login with username:', username);
      
      // Get the admin password from Firestore
      const settingsRef = doc(db, 'site_settings', 'admin_password');
      const settingsDoc = await getDoc(settingsRef);

      let adminPassword = 'kingdomstudio2025'; // Default fallback password

      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        adminPassword = data.value || adminPassword;
        console.log('Retrieved admin password from database');
      } else {
        console.warn('Could not fetch admin password from database, using default');
      }

      console.log('Comparing passwords...');
      const isValid = username === 'admin' && password === adminPassword;
      
      if (isValid) {
        // Store admin session
        localStorage.setItem('kbs-admin-session', 'authenticated');
        console.log('Login successful');
      } else {
        console.log('Login failed - invalid credentials');
      }
      
      return isValid;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Helper method to check admin authentication
  static isAdminAuthenticated(): boolean {
    return localStorage.getItem('kbs-admin-session') === 'authenticated';
  }

  // Businesses
  static async getBusinesses(): Promise<Business[]> {
    try {
      const businessesRef = collection(db, 'businesses');
      const q = query(businessesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          logo: data.logo,
          category: data.category,
          description: data.description,
          isNew: data.isNew || false
        };
      });
    } catch (error) {
      console.error('Error in getBusinesses:', error);
      return [];
    }
  }

  static async addBusiness(business: Omit<Business, 'id'>): Promise<void> {
    try {
      console.log('Adding business:', business);
      const businessesRef = collection(db, 'businesses');
      await addDoc(businessesRef, {
        name: business.name,
        logo: business.logo,
        category: business.category,
        description: business.description,
        isNew: business.isNew || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Business added successfully');
    } catch (error) {
      console.error('Error in addBusiness:', error);
      throw new Error(`Failed to add business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    try {
      console.log('Updating business:', id, business);
      const businessRef = doc(db, 'businesses', id);
      const updateData: any = {
        updatedAt: serverTimestamp()
      };
      
      if (business.name !== undefined) updateData.name = business.name;
      if (business.logo !== undefined) updateData.logo = business.logo;
      if (business.category !== undefined) updateData.category = business.category;
      if (business.description !== undefined) updateData.description = business.description;
      if (business.isNew !== undefined) updateData.isNew = business.isNew;

      await updateDoc(businessRef, updateData);
      console.log('Business updated successfully');
    } catch (error) {
      console.error('Error in updateBusiness:', error);
      throw new Error(`Failed to update business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async removeBusiness(id: string): Promise<void> {
    try {
      console.log('Removing business:', id);
      const businessRef = doc(db, 'businesses', id);
      await deleteDoc(businessRef);
      console.log('Business removed successfully');
    } catch (error) {
      console.error('Error in removeBusiness:', error);
      throw new Error(`Failed to remove business: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Blog Posts
  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const blogPostsRef = collection(db, 'blog_posts');
      const q = query(blogPostsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          date: data.date,
          category: data.category,
          imageUrl: data.imageUrl
        };
      });
    } catch (error) {
      console.error('Error in getBlogPosts:', error);
      return [];
    }
  }

  static async addBlogPost(post: Omit<BlogPost, 'id'>): Promise<void> {
    try {
      console.log('Adding blog post:', post);
      const blogPostsRef = collection(db, 'blog_posts');
      await addDoc(blogPostsRef, {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.date,
        category: post.category,
        imageUrl: post.imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Blog post added successfully');
    } catch (error) {
      console.error('Error in addBlogPost:', error);
      throw new Error(`Failed to add blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
    try {
      console.log('Updating blog post:', id, post);
      const blogPostRef = doc(db, 'blog_posts', id);
      const updateData: any = {
        updatedAt: serverTimestamp()
      };
      
      if (post.title !== undefined) updateData.title = post.title;
      if (post.excerpt !== undefined) updateData.excerpt = post.excerpt;
      if (post.content !== undefined) updateData.content = post.content;
      if (post.author !== undefined) updateData.author = post.author;
      if (post.date !== undefined) updateData.date = post.date;
      if (post.category !== undefined) updateData.category = post.category;
      if (post.imageUrl !== undefined) updateData.imageUrl = post.imageUrl;

      await updateDoc(blogPostRef, updateData);
      console.log('Blog post updated successfully');
    } catch (error) {
      console.error('Error in updateBlogPost:', error);
      throw new Error(`Failed to update blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async removeBlogPost(id: string): Promise<void> {
    try {
      console.log('Removing blog post:', id);
      const blogPostRef = doc(db, 'blog_posts', id);
      await deleteDoc(blogPostRef);
      console.log('Blog post removed successfully');
    } catch (error) {
      console.error('Error in removeBlogPost:', error);
      throw new Error(`Failed to remove blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Programs
  static async getPrograms(): Promise<Program[]> {
    try {
      const programsRef = collection(db, 'programs');
      const querySnapshot = await getDocs(programsRef);

      const programs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          primaryColor: data.primaryColor,
          accentColors: data.accentColors || [],
          features: data.features || []
        };
      });

      // If no programs exist, return default programs
      if (programs.length === 0) {
        return this.getDefaultPrograms();
      }

      return programs;
    } catch (error) {
      console.error('Error in getPrograms:', error);
      return this.getDefaultPrograms();
    }
  }

  static getDefaultPrograms(): Program[] {
    return [
      {
        id: 'kingdom-entrepreneur',
        name: 'Kingdom Entrepreneur',
        description: 'Transform your business with biblical principles and modern strategies.',
        primaryColor: '#1e40af',
        accentColors: ['#3b82f6', '#60a5fa', '#93c5fd'],
        features: [
          'Biblical business principles',
          'Modern marketing strategies',
          'Financial management',
          'Leadership development',
          'Networking opportunities'
        ]
      },
      {
        id: 'faith-based-leadership',
        name: 'Faith-Based Leadership',
        description: 'Develop leadership skills grounded in faith and integrity.',
        primaryColor: '#059669',
        accentColors: ['#10b981', '#34d399', '#6ee7b7'],
        features: [
          'Servant leadership principles',
          'Team building strategies',
          'Conflict resolution',
          'Communication skills',
          'Decision making frameworks'
        ]
      },
      {
        id: 'kingdom-finance',
        name: 'Kingdom Finance',
        description: 'Master financial stewardship with Godly wisdom.',
        primaryColor: '#dc2626',
        accentColors: ['#ef4444', '#f87171', '#fca5a5'],
        features: [
          'Biblical financial principles',
          'Investment strategies',
          'Debt management',
          'Wealth building',
          'Generosity planning'
        ]
      }
    ];
  }

  static async insertDefaultPrograms(): Promise<void> {
    try {
      const programsRef = collection(db, 'programs');
      const defaultPrograms = this.getDefaultPrograms();
      
      for (const program of defaultPrograms) {
        await addDoc(programsRef, {
          ...program,
          updatedAt: serverTimestamp()
        });
      }
      console.log('Default programs inserted successfully');
    } catch (error) {
      console.error('Error in insertDefaultPrograms:', error);
      throw new Error(`Failed to insert default programs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateProgram(id: string, program: Partial<Program>): Promise<void> {
    try {
      console.log('Updating program:', id, program);
      const programRef = doc(db, 'programs', id);
      const updateData: any = {
        updatedAt: serverTimestamp()
      };
      
      if (program.name !== undefined) updateData.name = program.name;
      if (program.description !== undefined) updateData.description = program.description;
      if (program.primaryColor !== undefined) updateData.primaryColor = program.primaryColor;
      if (program.accentColors !== undefined) updateData.accentColors = program.accentColors;
      if (program.features !== undefined) updateData.features = program.features;

      await updateDoc(programRef, updateData);
      console.log('Program updated successfully');
    } catch (error) {
      console.error('Error in updateProgram:', error);
      throw new Error(`Failed to update program: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Registrations
  static async getRegistrations(): Promise<any[]> {
    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          country: data.country,
          industry: data.industry,
          businessIdea: data.businessIdea,
          openToCollaboration: data.openToCollaboration,
          bornAgain: data.bornAgain,
          available8Weeks: data.available8Weeks,
          timePreference: data.timePreference,
          daysPreference: data.daysPreference || [],
          paymentMethod: data.paymentMethod,
          paymentProof: data.paymentProof,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        };
      });
    } catch (error) {
      console.error('Error in getRegistrations:', error);
      return [];
    }
  }

  static async addRegistration(registration: any): Promise<void> {
    try {
      console.log('Adding registration:', registration);
      const registrationsRef = collection(db, 'registrations');
      await addDoc(registrationsRef, {
        fullName: registration.fullName,
        phoneNumber: registration.phoneNumber,
        country: registration.country,
        industry: registration.industry,
        businessIdea: registration.businessIdea,
        openToCollaboration: registration.openToCollaboration,
        bornAgain: registration.bornAgain,
        available8Weeks: registration.available8Weeks,
        timePreference: registration.timePreference,
        daysPreference: registration.daysPreference,
        paymentMethod: registration.paymentMethod,
        paymentProof: registration.paymentProof,
        createdAt: serverTimestamp()
      });
      console.log('Registration added successfully');
    } catch (error) {
      console.error('Error in addRegistration:', error);
      throw new Error(`Failed to add registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async removeRegistration(id: string): Promise<void> {
    try {
      console.log('Removing registration:', id);
      const registrationRef = doc(db, 'registrations', id);
      await deleteDoc(registrationRef);
      console.log('Registration removed successfully');
    } catch (error) {
      console.error('Error in removeRegistration:', error);
      throw new Error(`Failed to remove registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Site Settings
  static async getSetting(key: string): Promise<any> {
    try {
      const settingRef = doc(db, 'site_settings', key);
      const settingDoc = await getDoc(settingRef);
      
      if (settingDoc.exists()) {
        return settingDoc.data().value;
      }
      return null;
    } catch (error) {
      console.error('Error in getSetting:', error);
      return null;
    }
  }

  static async updateSetting(key: string, value: any): Promise<void> {
    try {
      console.log('Updating setting:', key, value);
      const settingRef = doc(db, 'site_settings', key);
      await setDoc(settingRef, {
        value: value,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('Setting updated successfully');
    } catch (error) {
      console.error('Error in updateSetting:', error);
      throw new Error(`Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getRegistrationPrice(): Promise<number> {
    try {
      const price = await this.getSetting('registration_price');
      return price || 3000;
    } catch (error) {
      console.error('Error in getRegistrationPrice:', error);
      return 3000;
    }
  }

  static async updateRegistrationPrice(price: number): Promise<void> {
    try {
      await this.updateSetting('registration_price', price);
    } catch (error) {
      console.error('Error in updateRegistrationPrice:', error);
      throw error;
    }
  }

  static async getContactInfo(): Promise<ContactInfo> {
    try {
      const contactInfo = await this.getSetting('contact_info');
      return contactInfo || {
        phone: '+254 700 123 456',
        email: 'info@kingdombusinessstudio.com',
        whatsapp: '+254700123456',
        location: 'Nairobi, Kenya',
      };
    } catch (error) {
      console.error('Error in getContactInfo:', error);
      return {
        phone: '+254 700 123 456',
        email: 'info@kingdombusinessstudio.com',
        whatsapp: '+254700123456',
        location: 'Nairobi, Kenya',
      };
    }
  }

  static async updateContactInfo(info: ContactInfo): Promise<void> {
    try {
      await this.updateSetting('contact_info', info);
    } catch (error) {
      console.error('Error in updateContactInfo:', error);
      throw error;
    }
  }

  static async getSocialMediaLinks(): Promise<SocialMediaLinks> {
    try {
      const socialLinks = await this.getSetting('social_media_links');
      return socialLinks || {
        facebook: 'https://facebook.com/kingdombusinessstudio',
        instagram: 'https://instagram.com/kingdombusinessstudio',
        twitter: 'https://twitter.com/kingdombusiness',
        linkedin: 'https://linkedin.com/company/kingdom-business-studio',
      };
    } catch (error) {
      console.error('Error in getSocialMediaLinks:', error);
      return {
        facebook: 'https://facebook.com/kingdombusinessstudio',
        instagram: 'https://instagram.com/kingdombusinessstudio',
        twitter: 'https://twitter.com/kingdombusiness',
        linkedin: 'https://linkedin.com/company/kingdom-business-studio',
      };
    }
  }

  static async updateSocialMediaLinks(links: SocialMediaLinks): Promise<void> {
    try {
      await this.updateSetting('social_media_links', links);
    } catch (error) {
      console.error('Error in updateSocialMediaLinks:', error);
      throw error;
    }
  }

  static async updateAdminPassword(newPassword: string): Promise<void> {
    try {
      await this.updateSetting('admin_password', newPassword);
    } catch (error) {
      console.error('Error in updateAdminPassword:', error);
      throw error;
    }
  }
}