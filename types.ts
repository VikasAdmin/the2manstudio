export interface Service {
  id: string;
  title: string;
  category: 'Pre-Wedding' | 'Wedding' | 'Pre-Baby' | 'Photoshoot' | 'Jewelry' | 'Cloths' | 'Birthday';
  description: string;
  imageUrl: string; // Primary thumbnail
  gallery: string[]; // Array of images for carousel
  price?: string;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  logoHeight: number;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  darkMode: boolean;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string; // Added address
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    whatsapp: string;
  };
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text. For this demo, we store it to allow editing.
  role: 'admin' | 'guest';
}