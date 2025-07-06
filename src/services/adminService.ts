import { supabase, supabaseAdmin } from '../lib/supabase';
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
      
      // First try to get the admin password from the database
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();

      let adminPassword = 'kingdomstudio2025'; // Default fallback password

      if (error) {
        console.warn('Could not fetch admin password from database, using default:', error);
      } else if (data?.value) {
        // Handle both string and JSON string formats
        if (typeof data.value === 'string') {
          adminPassword = data.value.replace(/^"|"$/g, ''); // Remove quotes if present
        } else {
          adminPassword = data.value;
        }
        console.log('Retrieved admin password from database');
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

  // Get the appropriate client for operations
  static getClient() {
    // Always use supabaseAdmin for write operations to bypass RLS
    return supabaseAdmin;
  }

  // Businesses
  static async getBusinesses(): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        name: item.name,
        logo: item.logo,
        category: item.category,
        description: item.description,
        isNew: item.is_new
      })) || [];
    } catch (error) {
      console.error('Error in getBusinesses:', error);
      return [];
    }
  }

  static async addBusiness(business: Omit<Business, 'id'>): Promise<void> {
    try {
      console.log('Adding business:', business);
      const client = this.getClient();
      const { error } = await client
        .from('businesses')
        .insert({
          name: business.name,
          logo: business.logo,
          category: business.category,
          description: business.description,
          is_new: business.isNew || false
        });

      if (error) {
        console.error('Error adding business:', error);
        throw new Error(`Failed to add business: ${error.message}`);
      }
      console.log('Business added successfully');
    } catch (error) {
      console.error('Error in addBusiness:', error);
      throw error;
    }
  }

  static async updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    try {
      console.log('Updating business:', id, business);
      const updateData: any = {};
      if (business.name !== undefined) updateData.name = business.name;
      if (business.logo !== undefined) updateData.logo = business.logo;
      if (business.category !== undefined) updateData.category = business.category;
      if (business.description !== undefined) updateData.description = business.description;
      if (business.isNew !== undefined) updateData.is_new = business.isNew;

      const client = this.getClient();
      const { error } = await client
        .from('businesses')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating business:', error);
        throw new Error(`Failed to update business: ${error.message}`);
      }
      console.log('Business updated successfully');
    } catch (error) {
      console.error('Error in updateBusiness:', error);
      throw error;
    }
  }

  static async removeBusiness(id: string): Promise<void> {
    try {
      console.log('Removing business:', id);
      const client = this.getClient();
      const { error } = await client
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing business:', error);
        throw new Error(`Failed to remove business: ${error.message}`);
      }
      console.log('Business removed successfully');
    } catch (error) {
      console.error('Error in removeBusiness:', error);
      throw error;
    }
  }

  // Blog Posts
  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        author: item.author,
        date: item.date,
        category: item.category,
        imageUrl: item.image_url
      })) || [];
    } catch (error) {
      console.error('Error in getBlogPosts:', error);
      return [];
    }
  }

  static async addBlogPost(post: Omit<BlogPost, 'id'>): Promise<void> {
    try {
      console.log('Adding blog post:', post);
      const client = this.getClient();
      const { error } = await client
        .from('blog_posts')
        .insert({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          date: post.date,
          category: post.category,
          image_url: post.imageUrl
        });

      if (error) {
        console.error('Error adding blog post:', error);
        throw new Error(`Failed to add blog post: ${error.message}`);
      }
      console.log('Blog post added successfully');
    } catch (error) {
      console.error('Error in addBlogPost:', error);
      throw error;
    }
  }

  static async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
    try {
      console.log('Updating blog post:', id, post);
      const updateData: any = {};
      if (post.title !== undefined) updateData.title = post.title;
      if (post.excerpt !== undefined) updateData.excerpt = post.excerpt;
      if (post.content !== undefined) updateData.content = post.content;
      if (post.author !== undefined) updateData.author = post.author;
      if (post.date !== undefined) updateData.date = post.date;
      if (post.category !== undefined) updateData.category = post.category;
      if (post.imageUrl !== undefined) updateData.image_url = post.imageUrl;

      const client = this.getClient();
      const { error } = await client
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to update blog post: ${error.message}`);
      }
      console.log('Blog post updated successfully');
    } catch (error) {
      console.error('Error in updateBlogPost:', error);
      throw error;
    }
  }

  static async removeBlogPost(id: string): Promise<void> {
    try {
      console.log('Removing blog post:', id);
      const client = this.getClient();
      const { error } = await client
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing blog post:', error);
        throw new Error(`Failed to remove blog post: ${error.message}`);
      }
      console.log('Blog post removed successfully');
    } catch (error) {
      console.error('Error in removeBlogPost:', error);
      throw error;
    }
  }

  // Programs
  static async getPrograms(): Promise<Program[]> {
    try {
      console.log('Fetching programs...');
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching programs:', error);
        // Return default programs if database fetch fails
        return this.getDefaultPrograms();
      }

      if (!data || data.length === 0) {
        console.log('No programs found in database, inserting defaults...');
        await this.insertDefaultPrograms();
        return this.getDefaultPrograms();
      }

      const programs = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        primaryColor: item.primary_color,
        accentColors: item.accent_colors,
        features: item.features
      }));

      console.log('Programs fetched successfully:', programs);
      return programs;
    } catch (error) {
      console.error('Error in getPrograms:', error);
      return this.getDefaultPrograms();
    }
  }

  static getDefaultPrograms(): Program[] {
    return [
      {
        id: 'whats-in-your-hand',
        name: "What's in Your Hand",
        description: "An 8-week business development studio for kingdom-minded individuals who want to build ventures rooted in God's vision. Whether transitioning from a 9–5 or launching a business alongside your job, this program helps participants create, refine, and launch a profitable venture, guided by biblical values, spiritual clarity, and strategic structure.",
        primaryColor: 'royal-blue',
        accentColors: ['mustard-yellow', 'ivory'],
        features: [
          '8-week intensive program',
          'Biblical business principles',
          'Spiritual clarity sessions',
          'Strategic structure development',
          'Peer collaboration',
          'Expert mentorship'
        ]
      },
      {
        id: 'net-in-the-deep',
        name: 'Net in the Deep',
        description: 'A track for those ready to go deeper. It focuses on scaling, structure, spiritual discipline, and obedience-driven action. Ideal for those with businesses in development who want to formalize and scale in alignment with their faith.',
        primaryColor: 'mustard-yellow',
        accentColors: ['ivory', 'royal-blue'],
        features: [
          'Business scaling strategies',
          'Spiritual discipline training',
          'Obedience-driven action plans',
          'Formalization processes',
          'Faith-aligned scaling',
          'Advanced mentorship'
        ]
      },
      {
        id: 'the-boat',
        name: 'The Boat',
        description: 'A content hub for teaching, storytelling, and prophetic business conversations via YouTube. Join us for inspiring content that bridges faith and entrepreneurship.',
        primaryColor: 'royal-blue',
        accentColors: ['mustard-yellow', 'ivory'],
        features: [
          'Weekly YouTube content',
          'Prophetic business insights',
          'Success stories',
          'Teaching sessions',
          'Community discussions',
          'Live Q&A sessions'
        ]
      }
    ];
  }

  static async insertDefaultPrograms(): Promise<void> {
    try {
      console.log('Inserting default programs...');
      const client = this.getClient();
      const programs = this.getDefaultPrograms();

      for (const program of programs) {
        const { error } = await client
          .from('programs')
          .upsert({
            id: program.id,
            name: program.name,
            description: program.description,
            primary_color: program.primaryColor,
            accent_colors: program.accentColors,
            features: program.features
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error(`Error inserting program ${program.id}:`, error);
        } else {
          console.log(`Program ${program.id} inserted successfully`);
        }
      }
    } catch (error) {
      console.error('Error inserting default programs:', error);
    }
  }

  static async updateProgram(id: string, program: Partial<Program>): Promise<void> {
    try {
      console.log('Updating program:', id, program);
      const updateData: any = {};
      if (program.name !== undefined) updateData.name = program.name;
      if (program.description !== undefined) updateData.description = program.description;
      if (program.primaryColor !== undefined) updateData.primary_color = program.primaryColor;
      if (program.accentColors !== undefined) updateData.accent_colors = program.accentColors;
      if (program.features !== undefined) updateData.features = program.features;

      const client = this.getClient();
      const { error } = await client
        .from('programs')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating program:', error);
        throw new Error(`Failed to update program: ${error.message}`);
      }
      console.log('Program updated successfully');
    } catch (error) {
      console.error('Error in updateProgram:', error);
      throw error;
    }
  }

  // Registrations
  static async getRegistrations(): Promise<any[]> {
    if (!this.isAdminAuthenticated()) {
      return [];
    }

    try {
      const client = this.getClient();
      const { data, error } = await client
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        fullName: item.full_name,
        phoneNumber: item.phone_number,
        country: item.country,
        industry: item.industry,
        businessIdea: item.business_idea,
        openToCollaboration: item.open_to_collaboration,
        bornAgain: item.born_again,
        available8Weeks: item.available_8_weeks,
        timePreference: item.time_preference,
        daysPreference: item.days_preference,
        paymentMethod: item.payment_method,
        paymentProof: item.payment_proof,
        timestamp: item.created_at
      })) || [];
    } catch (error) {
      console.error('Error in getRegistrations:', error);
      return [];
    }
  }

  static async addRegistration(registration: any): Promise<void> {
    try {
      console.log('Adding registration:', registration);
      const { error } = await supabase
        .from('registrations')
        .insert({
          full_name: registration.fullName,
          phone_number: registration.phoneNumber,
          country: registration.country,
          industry: registration.industry,
          business_idea: registration.businessIdea,
          open_to_collaboration: registration.openToCollaboration,
          born_again: registration.bornAgain,
          available_8_weeks: registration.available8Weeks,
          time_preference: registration.timePreference,
          days_preference: registration.daysPreference,
          payment_method: registration.paymentMethod,
          payment_proof: registration.paymentProof
        });

      if (error) {
        console.error('Error adding registration:', error);
        throw new Error(`Failed to add registration: ${error.message}`);
      }
      console.log('Registration added successfully');
    } catch (error) {
      console.error('Error in addRegistration:', error);
      throw error;
    }
  }

  static async removeRegistration(id: string): Promise<void> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Admin authentication required');
    }

    try {
      console.log('Removing registration:', id);
      const client = this.getClient();
      const { error } = await client
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing registration:', error);
        throw new Error(`Failed to remove registration: ${error.message}`);
      }
      console.log('Registration removed successfully');
    } catch (error) {
      console.error('Error in removeRegistration:', error);
      throw error;
    }
  }

  // Site Settings - Enhanced with better error handling and retry logic
  static async getSetting(key: string): Promise<any> {
    try {
      console.log(`Fetching setting: ${key}`);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        console.error(`Error fetching setting ${key}:`, error);
        return null;
      }
      console.log(`Setting ${key} fetched:`, data?.value);
      return data?.value;
    } catch (error) {
      console.error(`Error in getSetting for ${key}:`, error);
      return null;
    }
  }

  static async updateSetting(key: string, value: any): Promise<void> {
    try {
      console.log(`Updating setting ${key} with value:`, value);
      
      const client = this.getClient();
      
      // First try to update existing record
      const { data: updateData, error: updateError } = await client
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select();

      if (updateError || !updateData || updateData.length === 0) {
        console.log(`Update failed or no rows affected, trying upsert for ${key}:`, updateError);
        
        // If update fails or affects no rows, try upsert
        const { error: upsertError } = await client
          .from('site_settings')
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (upsertError) {
          console.error(`Upsert failed for setting ${key}:`, upsertError);
          throw new Error(`Failed to update setting: ${upsertError.message}`);
        } else {
          console.log(`Successfully upserted setting ${key}`);
        }
      } else {
        console.log(`Successfully updated setting ${key}:`, updateData);
      }
    } catch (error) {
      console.error(`Error in updateSetting for ${key}:`, error);
      throw error;
    }
  }

  static async getRegistrationPrice(): Promise<number> {
    const price = await this.getSetting('registration_price');
    return typeof price === 'number' ? price : parseInt(price) || 3000;
  }

  static async updateRegistrationPrice(price: number): Promise<void> {
    console.log('Updating registration price to:', price);
    await this.updateSetting('registration_price', price);
  }

  static async getContactInfo(): Promise<ContactInfo> {
    const info = await this.getSetting('contact_info');
    return info || {
      phone: '+254 700 123 456',
      email: 'info@kingdombusinessstudio.com',
      whatsapp: '+254700123456',
      location: 'Nairobi, Kenya'
    };
  }

  static async updateContactInfo(info: ContactInfo): Promise<void> {
    console.log('Updating contact info:', info);
    await this.updateSetting('contact_info', info);
  }

  static async getSocialMediaLinks(): Promise<SocialMediaLinks> {
    const links = await this.getSetting('social_media_links');
    return links || {
      facebook: 'https://facebook.com/kingdombusinessstudio',
      instagram: 'https://instagram.com/kingdombusinessstudio',
      twitter: 'https://twitter.com/kingdombusiness',
      linkedin: 'https://linkedin.com/company/kingdom-business-studio'
    };
  }

  static async updateSocialMediaLinks(links: SocialMediaLinks): Promise<void> {
    console.log('Updating social media links:', links);
    await this.updateSetting('social_media_links', links);
  }

  static async updateAdminPassword(newPassword: string): Promise<void> {
    console.log('Updating admin password');
    await this.updateSetting('admin_password', newPassword);
  }
}