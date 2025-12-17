import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/AdminComponents';
import { Trash2, Edit, Plus, Save, Upload, X, Globe, User as UserIcon, Lock } from 'lucide-react';
import { Service, BlogPost, Destination, User, SiteSettings } from '../../types';

// Utility to compress images to ensure they fit in LocalStorage
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Limit max dimensions
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    // Compress to JPEG with 0.7 quality
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                } else {
                    reject(new Error("Canvas context failed"));
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export const Dashboard: React.FC = () => {
  const { services, blogPosts, destinations } = useApp();

  const stats = [
    { label: 'Total Services', value: services.length, color: 'bg-blue-500' },
    { label: 'Blog Posts', value: blogPosts.length, color: 'bg-green-500' },
    { label: 'Destinations', value: destinations.length, color: 'bg-purple-500' },
    { label: 'Total Views', value: '12.5K', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</p>
            <div className={`h-1 w-full mt-4 rounded-full ${stat.color} opacity-20`}>
              <div className={`h-1 w-2/3 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-4">Recent Blog Posts</h3>
           <div className="space-y-4">
             {blogPosts.slice(0, 3).map(post => (
               <div key={post.id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                 <img src={post.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                 <div>
                   <p className="font-bold text-sm text-gray-800">{post.title}</p>
                   <p className="text-xs text-gray-500">{post.date}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempService, setTempService] = useState<Service | null>(null);

  const startEditing = (service: Service) => {
    setEditingId(service.id);
    setTempService({ ...service });
  };

  const handleAddNew = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: 'New Service',
      category: 'Wedding',
      description: 'Description here...',
      imageUrl: 'https://via.placeholder.com/800',
      gallery: [],
      features: ['Feature 1']
    };
    // Add to global state first so it appears in list
    addService(newService);
    // Then immediately start editing it
    startEditing(newService);
  };

  const saveEditing = () => {
    if (tempService) {
      updateService(tempService);
      setEditingId(null);
      setTempService(null);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempService(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && tempService) {
      try {
        const compressedBase64 = await compressImage(file);
        
        // If no gallery, init it. If < 10, add.
        const currentGallery = tempService.gallery || [tempService.imageUrl];
        
        if (currentGallery.length < 10) {
           setTempService({ 
               ...tempService, 
               imageUrl: compressedBase64, // Set as primary
               gallery: [...currentGallery, compressedBase64] 
           });
        } else {
            alert("Maximum 10 images allowed per service.");
        }
      } catch (err) {
        console.error("Image compression failed", err);
        alert("Failed to process image. Please try a smaller file.");
      }
    }
  };
  
  const removeImageFromGallery = (indexToRemove: number) => {
      if (!tempService) return;
      const currentGallery = tempService.gallery || [tempService.imageUrl];
      const newGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
      
      setTempService({
          ...tempService,
          gallery: newGallery,
          // If we deleted the primary image, set primary to the new first image, or a placeholder if empty
          imageUrl: newGallery.length > 0 ? newGallery[0] : 'https://via.placeholder.com/800'
      });
  };

  return (
    <div>
      <AdminHeader title="Manage Services" action={
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm hover:opacity-90">
            <Plus size={16}/> Add New
        </button>
      } />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 w-48">Gallery</th>
              <th className="p-4 w-1/4">Title</th>
              <th className="p-4 w-32">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map(service => {
              const isEditing = editingId === service.id;
              const displayService = isEditing && tempService ? tempService : service;

              return (
              <tr key={service.id} className={`hover:bg-gray-50 ${isEditing ? 'bg-blue-50/50' : ''}`}>
                <td className="p-4 align-top">
                  {isEditing ? (
                    <div className="space-y-3">
                       <div className="grid grid-cols-3 gap-1">
                           {(displayService.gallery || [displayService.imageUrl]).map((img, idx) => (
                               <div key={idx} className="relative group">
                                   <img src={img} className="w-full h-10 object-cover rounded border" alt="" />
                                   <button 
                                      onClick={() => removeImageFromGallery(idx)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                       <X size={8} />
                                   </button>
                               </div>
                           ))}
                       </div>

                       <div className="relative">
                          <input 
                            type="file" 
                            id={`file-${service.id}`}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <label 
                            htmlFor={`file-${service.id}`}
                            className="flex items-center justify-center gap-1 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-1.5 px-2 rounded transition-colors shadow-sm"
                          >
                            <Upload size={12} />
                            <span>Add Image</span>
                          </label>
                       </div>
                    </div>
                  ) : (
                    <div className="relative">
                         <img src={displayService.imageUrl} alt="" className="w-20 h-16 object-cover rounded" />
                         {(displayService.gallery?.length || 0) > 1 && (
                             <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">
                                 +{displayService.gallery!.length - 1}
                             </span>
                         )}
                    </div>
                  )}
                </td>
                <td className="p-4 font-bold text-gray-800 align-top">
                  {isEditing ? (
                    <input 
                      className="border border-gray-300 p-2 w-full rounded focus:ring-1 focus:ring-primary focus:outline-none" 
                      value={displayService.title} 
                      onChange={(e) => setTempService({...tempService!, title: e.target.value})}
                    />
                  ) : service.title}
                </td>
                <td className="p-4 align-top">
                    {isEditing ? (
                        <select 
                            value={displayService.category}
                            onChange={(e) => setTempService({...tempService!, category: e.target.value as any})}
                            className="border border-gray-300 p-2 w-full rounded text-sm"
                        >
                            {['Pre-Wedding', 'Wedding', 'Pre-Baby', 'Photoshoot', 'Jewelry', 'Cloths', 'Birthday'].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    ) : (
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase">{service.category}</span>
                    )}
                </td>
                <td className="p-4 text-sm text-gray-500 align-top">
                  {isEditing ? (
                    <textarea 
                      className="border border-gray-300 p-2 w-full rounded focus:ring-1 focus:ring-primary focus:outline-none min-h-[80px]" 
                      value={displayService.description} 
                      onChange={(e) => setTempService({...tempService!, description: e.target.value})}
                    />
                  ) : (
                    <p className="line-clamp-3">{service.description}</p>
                  )}
                </td>
                <td className="p-4 align-top">
                  <div className="flex gap-2">
                    {isEditing ? (
                        <>
                           <button 
                            onClick={saveEditing} 
                            className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                            title="Save Changes"
                           >
                            <Save size={16} />
                           </button>
                           <button 
                            onClick={cancelEditing} 
                            className="p-2 rounded text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Cancel"
                           >
                            <X size={16} />
                           </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => startEditing(service)} 
                            className="p-2 rounded text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    
                    {!isEditing && (
                      <button 
                        onClick={() => { if(confirm('Are you sure?')) deleteService(service.id) }} 
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminDestinations: React.FC = () => {
    const { destinations, addDestination, updateDestination, deleteDestination } = useApp();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentDest, setCurrentDest] = useState<Destination | null>(null);

    const initialDest: Destination = {
        id: '',
        country: '',
        city: '',
        description: '',
        imageUrl: 'https://picsum.photos/seed/newdest/600/800'
    };

    const handleEdit = (dest: Destination) => {
        setCurrentDest(dest);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentDest({ ...initialDest, id: Date.now().toString() });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (currentDest) {
            const exists = destinations.find(d => d.id === currentDest.id);
            if (exists) {
                updateDestination(currentDest);
            } else {
                addDestination(currentDest);
            }
            setIsEditing(false);
            setCurrentDest(null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && currentDest) {
             try {
                const compressed = await compressImage(file);
                setCurrentDest({ ...currentDest, imageUrl: compressed });
            } catch (err) {
                alert("Image too large or invalid.");
            }
        }
    };

    if (isEditing && currentDest) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold">{destinations.find(d => d.id === currentDest.id) ? 'Edit Destination' : 'New Destination'}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                            <input className="w-full border p-2 rounded" value={currentDest.city} onChange={(e) => setCurrentDest({...currentDest, city: e.target.value})} />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                            <input className="w-full border p-2 rounded" value={currentDest.country} onChange={(e) => setCurrentDest({...currentDest, country: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea className="w-full border p-2 rounded h-24" value={currentDest.description} onChange={(e) => setCurrentDest({...currentDest, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
                         <div className="flex items-center gap-4">
                            <img src={currentDest.imageUrl} className="w-20 h-20 object-cover rounded" alt="" />
                            <div className="relative">
                                <input type="file" id="dest-img" className="hidden" onChange={handleImageUpload} />
                                <label htmlFor="dest-img" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded cursor-pointer text-sm flex items-center gap-2"><Upload size={14}/> Upload</label>
                            </div>
                         </div>
                    </div>
                    <button onClick={handleSave} className="w-full bg-primary text-white py-3 rounded font-bold">Save Destination</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <AdminHeader title="Manage Destinations" action={<button onClick={handleAddNew} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm hover:opacity-90"><Plus size={16}/> Add New</button>} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destinations.map(dest => (
                    <div key={dest.id} className="bg-white rounded shadow-sm border overflow-hidden group">
                        <div className="h-48 relative">
                            <img src={dest.imageUrl} alt={dest.city} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(dest)} className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform"><Edit size={16}/></button>
                                <button onClick={() => deleteDestination(dest.id)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{dest.city}, {dest.country}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{dest.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminBlog: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useApp();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  const initialPost: BlogPost = {
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'The 2 Man Studio',
    date: new Date().toISOString().split('T')[0],
    imageUrl: 'https://picsum.photos/seed/new/800/400',
    category: 'Wedding',
    tags: []
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPost({ ...initialPost, id: Date.now().toString() });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentPost) {
      // Update the date to today's date on save
      const postToSave = { ...currentPost, date: new Date().toISOString().split('T')[0] };
      
      const exists = blogPosts.find(p => p.id === postToSave.id);
      if (exists) {
        updateBlogPost(postToSave);
      } else {
        addBlogPost(postToSave);
      }
      setIsEditing(false);
      setCurrentPost(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentPost) {
        try {
            const compressed = await compressImage(file);
            setCurrentPost({ ...currentPost, imageUrl: compressed });
        } catch (err) {
            alert("Image error");
        }
    }
  };

  if (isEditing && currentPost) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold">{blogPosts.find(p => p.id === currentPost.id) ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  value={currentPost.category}
                  onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                  placeholder="e.g. Wedding, Tips"
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Feature Image</label>
             <div className="flex items-start gap-6">
                <img src={currentPost.imageUrl} alt="Preview" className="w-40 h-24 object-cover rounded border border-gray-200" />
                <div className="flex-1 space-y-3">
                   <input 
                      className="w-full border border-gray-300 p-2 rounded text-sm"
                      value={currentPost.imageUrl}
                      onChange={(e) => setCurrentPost({...currentPost, imageUrl: e.target.value})}
                      placeholder="Image URL"
                   />
                   <div className="relative">
                      <input 
                        type="file" 
                        id="blog-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label 
                        htmlFor="blog-image-upload"
                        className="inline-flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm transition-colors"
                      >
                        <Upload size={16} />
                        <span>Upload Local Image</span>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt (Short Summary)</label>
            <textarea 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none h-20"
              value={currentPost.excerpt}
              onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
              placeholder="Brief summary shown on listings..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Content</label>
            <textarea 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none h-64 font-mono text-sm"
              value={currentPost.content}
              onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  value={currentPost.author}
                  onChange={(e) => setCurrentPost({...currentPost, author: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date (Updates on Save)</label>
                <input 
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 p-2 rounded text-gray-500"
                  value={currentPost.date}
                />
             </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
             <button 
               onClick={handleSave}
               className="bg-primary text-white px-8 py-3 rounded font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
             >
               <Save size={18} />
               Save Post
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Blog Management" action={
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm hover:opacity-90">
          <Plus size={16}/> Add New Post
        </button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative">
               <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow">{post.category}</div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-xs text-gray-500 mb-2">{post.date} • {post.author}</div>
              <h3 className="font-bold text-lg mb-2 leading-tight">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(post)}
                  className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => deleteBlogPost(post.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, users, addUser, updateUser, deleteUser, currentUser } = useApp();
  const fonts = ['Playfair Display', 'Lato', 'Montserrat', 'Open Sans', 'Roboto'];
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSocialChange = (field: keyof SiteSettings['socialLinks'], value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsDirty(false);
    alert('Settings saved successfully!');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const compressed = await compressImage(file);
            handleChange('logoUrl', compressed);
        } catch(e) {
            alert('Image too large');
        }
    }
  };

  const handleAddUser = () => {
      if(newUser.username && newUser.password) {
          addUser({ id: Date.now().toString(), username: newUser.username, password: newUser.password, role: 'admin' });
          setNewUser({ username: '', password: '' });
      }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <AdminHeader 
        title="Site Settings" 
        action={
          <button 
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-6 py-2 rounded shadow-sm font-bold transition-all ${isDirty ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <Save size={18} />
            {isDirty ? 'Save Changes' : 'Saved'}
          </button>
        }
      />
      
      {/* Branding Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2"><Globe size={20}/> Branding & Theme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
              <input 
                type="text" 
                value={localSettings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
              <input 
                type="text" 
                value={localSettings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Logo</label>
              <div className="flex items-start gap-4">
                 <div className="w-24 h-24 bg-[#333] rounded flex items-center justify-center overflow-hidden border border-gray-300 shadow-inner">
                    {localSettings.logoUrl ? (
                        <img src={localSettings.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-xs text-gray-400">No Logo</span>
                    )}
                 </div>
                 <div className="flex-1 space-y-3">
                    <input 
                        type="text" 
                        value={localSettings.logoUrl}
                        onChange={(e) => handleChange('logoUrl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="https://example.com/logo.png"
                    />
                    <div className="flex items-center gap-4">
                        <div className="relative inline-block">
                            <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            <label htmlFor="logo-upload" className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm transition-colors">
                                <Upload size={14} /> Upload
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-700">Height:</label>
                            <input type="range" min="20" max="120" value={localSettings.logoHeight} onChange={(e) => handleChange('logoHeight', parseInt(e.target.value))} className="w-32 accent-primary"/>
                            <span className="text-xs text-gray-500">{localSettings.logoHeight}px</span>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={localSettings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="h-10 w-10 border-0 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{localSettings.primaryColor}</span>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Dark Mode</label>
                 <button 
                  onClick={() => handleChange('darkMode', !localSettings.darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localSettings.darkMode ? 'bg-primary' : 'bg-gray-200'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Heading Font</label>
                  <select value={localSettings.headingFont} onChange={(e) => handleChange('headingFont', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Body Font</label>
                  <select value={localSettings.bodyFont} onChange={(e) => handleChange('bodyFont', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
               </div>
            </div>
          </div>
      </div>

      {/* Social Media & Contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2"><Globe size={20}/> Contact & Socials</h3>
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                   <input type="text" value={localSettings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Phone (with Country Code)</label>
                   <input type="text" value={localSettings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="+1 (555) 123-4567" />
                 </div>
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location / Address</label>
                <input type="text" value={localSettings.contactAddress} onChange={(e) => handleChange('contactAddress', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
                <input type="text" value={localSettings.socialLinks.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
                <input type="text" value={localSettings.socialLinks.facebook} onChange={(e) => handleSocialChange('facebook', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Twitter URL</label>
                <input type="text" value={localSettings.socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp URL</label>
                <input type="text" placeholder="https://wa.me/1234567890" value={localSettings.socialLinks.whatsapp} onChange={(e) => handleSocialChange('whatsapp', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
             </div>
           </div>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2"><UserIcon size={20}/> User Management</h3>
          
          <div className="space-y-4 mb-6">
              {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-3">
                          <div className="bg-primary text-white p-2 rounded-full"><UserIcon size={16}/></div>
                          <div>
                              <p className="font-bold text-sm">{u.username}</p>
                              <p className="text-xs text-gray-500">ID: {u.id}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                           {/* Allow changing password */}
                           <input 
                              type="text" 
                              placeholder="New Pass" 
                              className="text-xs border p-1 rounded w-24" 
                              onChange={(e) => {
                                  // Live update password (in real app, use a modal/form)
                                  if(e.target.value) updateUser({...u, password: e.target.value})
                              }}
                           />
                           {users.length > 1 && u.id !== currentUser?.id && (
                               <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-100 p-2 rounded"><Trash2 size={16}/></button>
                           )}
                      </div>
                  </div>
              ))}
          </div>

          {users.length < 2 && (
              <div className="border-t pt-4">
                  <h4 className="text-sm font-bold mb-3">Add New User</h4>
                  <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                      />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                      />
                      <button 
                        onClick={handleAddUser}
                        className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90"
                      >
                          Add User
                      </button>
                  </div>
              </div>
          )}
          {users.length >= 2 && <p className="text-xs text-gray-500">Maximum 2 users allowed.</p>}
      </div>

    </div>
  );
};