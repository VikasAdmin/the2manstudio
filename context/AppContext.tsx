import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, BlogPost, Destination, SiteSettings, User } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  
  services: Service[];
  addService: (service: Service) => void;
  updateService: (updated: Service) => void;
  deleteService: (id: string) => void;
  
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  
  destinations: Destination[];
  addDestination: (dest: Destination) => void;
  updateDestination: (dest: Destination) => void;
  deleteDestination: (id: string) => void;

  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Cinematic Pre-Wedding',
    category: 'Pre-Wedding',
    description: 'Capture the romance and excitement before your big day with our signature cinematic style.',
    imageUrl: 'https://images.unsplash.com/photo-1596359903932-5ee35d082e6d?q=80&w=2070&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1596359903932-5ee35d082e6d?q=80&w=2070&auto=format&fit=crop'],
    features: ['2 Locations', '3 Outfit Changes', 'Cinematic Highlight Reel']
  },
  {
    id: '2',
    title: 'International Wedding Coverage',
    category: 'Wedding',
    description: 'Full coverage of your special day, documenting every emotion and detail.',
    imageUrl: 'https://picsum.photos/seed/wedding/800/600',
    gallery: ['https://picsum.photos/seed/wedding/800/600', 'https://picsum.photos/seed/wed2/800/600'],
    features: ['Unlimited Hours', '2 Senior Photographers', 'Drone Coverage']
  },
  {
    id: '3',
    title: 'Maternity Aesthetics',
    category: 'Pre-Baby',
    description: 'Celebrating the miracle of life with elegant and comfortable sessions.',
    imageUrl: 'https://picsum.photos/seed/maternity/800/600',
    gallery: [],
    features: ['Studio or Outdoor', 'Gown Rental Included']
  },
  {
    id: '4',
    title: 'High-Fashion Editorial',
    category: 'Photoshoot',
    description: 'Magazine-quality editorial shoots for models and brands.',
    imageUrl: 'https://picsum.photos/seed/fashion/800/600',
    gallery: [],
    features: ['Professional Styling', 'High-End Retouching']
  },
  {
    id: '5',
    title: 'Luxury Jewelry',
    category: 'Jewelry',
    description: 'Macro photography that highlights the brilliance of your gems.',
    imageUrl: 'https://picsum.photos/seed/jewelry/800/600',
    gallery: [],
    features: ['Macro Lens Specialist', 'Lightbox Setup']
  },
  {
    id: '6',
    title: 'Apparel & Cloths',
    category: 'Cloths',
    description: 'E-commerce and lookbook photography for fashion brands.',
    imageUrl: 'https://picsum.photos/seed/cloths/800/600',
    gallery: [],
    features: ['Ghost Mannequin', 'Model Shoots']
  },
  {
    id: '7',
    title: 'Birthday Celebrations',
    category: 'Birthday',
    description: 'Fun, vibrant coverage for birthdays of all ages.',
    imageUrl: 'https://picsum.photos/seed/birthday/800/600',
    gallery: [],
    features: ['Candid Moments', 'Group Portraits']
  },
];

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Capturing Love in Paris',
    excerpt: 'Our recent shoot near the Eiffel Tower was nothing short of magical.',
    content: 'Full story about the Paris shoot...',
    author: 'The 2 Man Studio',
    date: '2023-10-15',
    imageUrl: 'https://picsum.photos/seed/paris/800/400',
    category: 'Destination',
    tags: ['Paris', 'Wedding', 'Travel']
  },
  {
    id: '2',
    title: 'Top 5 Tips for your Pre-Wedding Shoot',
    excerpt: 'How to prepare for your session to get the best results.',
    content: 'Preparation tips...',
    author: 'The 2 Man Studio',
    date: '2023-11-02',
    imageUrl: 'https://picsum.photos/seed/tips/800/400',
    category: 'Guide',
    tags: ['Tips', 'Planning']
  }
];

const INITIAL_DESTINATIONS: Destination[] = [
  { id: '1', country: 'France', city: 'Paris', description: 'The city of love.', imageUrl: 'https://picsum.photos/seed/dest1/600/800' },
  { id: '2', country: 'Italy', city: 'Venice', description: 'Romantic canals and history.', imageUrl: 'https://picsum.photos/seed/dest2/600/800' },
  { id: '3', country: 'Japan', city: 'Kyoto', description: 'Traditional temples and cherry blossoms.', imageUrl: 'https://picsum.photos/seed/dest3/600/800' },
  { id: '4', country: 'Iceland', city: 'Reykjavik', description: 'Dramatic landscapes and northern lights.', imageUrl: 'https://picsum.photos/seed/dest4/600/800' },
];

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'The 2 Men Studio',
  tagline: 'Capturing Moments, Creating Legacies',
  logoUrl: 'assets/logo.svg',
  logoHeight: 48,
  primaryColor: '#1a1a1a',
  headingFont: 'Playfair Display',
  bodyFont: 'Lato',
  darkMode: false,
  contactEmail: 'hello@2manstudio.com',
  contactPhone: '+1 (555) 0123-456',
  contactAddress: '123 Creative Studio Blvd, New York, NY 10012',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    whatsapp: 'https://whatsapp.com'
  }
};

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', password: 'admin@saurabh221106', role: 'admin' }
];

// Helper to load from localStorage with a fallback
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
};

const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            alert("Storage limit exceeded! Your changes may not be saved. Please delete some items or use smaller images.");
        } else {
            console.error("Error saving to localStorage", e);
        }
    }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Current user session (not persisted permanently across browser restarts usually, but here we can keep session active)
    const stored = sessionStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [users, setUsers] = useState<User[]>(() => loadFromStorage('site_users', INITIAL_USERS));
  const [services, setServices] = useState<Service[]>(() => loadFromStorage('site_services', INITIAL_SERVICES));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('site_blog', INITIAL_POSTS));
  const [destinations, setDestinations] = useState<Destination[]>(() => loadFromStorage('site_destinations', INITIAL_DESTINATIONS));
  const [settings, setSettings] = useState<SiteSettings>(() => loadFromStorage('site_settings', INITIAL_SETTINGS));

  // Persistence Effects
  useEffect(() => {
    saveToStorage('site_users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('site_services', services);
  }, [services]);

  useEffect(() => {
    saveToStorage('site_blog', blogPosts);
  }, [blogPosts]);

  useEffect(() => {
    saveToStorage('site_destinations', destinations);
  }, [destinations]);

  useEffect(() => {
    saveToStorage('site_settings', settings);
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);


  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  
  const logout = () => setCurrentUser(null);

  const addUser = (user: User) => {
    if (users.length < 2) {
      setUsers(prev => [...prev, user]);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addService = (service: Service) => setServices(prev => [service, ...prev]);
  const updateService = (updated: Service) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };
  const deleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));

  const addBlogPost = (post: BlogPost) => setBlogPosts(prev => [post, ...prev]);
  const updateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };
  const deleteBlogPost = (id: string) => setBlogPosts(prev => prev.filter(p => p.id !== id));

  const addDestination = (dest: Destination) => setDestinations(prev => [...prev, dest]);
  const updateDestination = (dest: Destination) => setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
  const deleteDestination = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Apply visual settings
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--font-heading', settings.headingFont);
    root.style.setProperty('--font-body', settings.bodyFont);
    
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  return (
    <AppContext.Provider value={{
      currentUser, users, login, logout, addUser, updateUser, deleteUser,
      services, addService, updateService, deleteService,
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
      destinations, addDestination, updateDestination, deleteDestination,
      settings, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};