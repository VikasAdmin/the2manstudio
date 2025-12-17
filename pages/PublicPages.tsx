import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, User, Clock, Instagram, Send } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-surface text-text">
       <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
             <h1 className="text-5xl font-heading font-bold mb-8">Behind The Lens</h1>
             <p className="text-xl text-gray-600 leading-relaxed">
               We are "The 2 Man Studio" – a duo of passionate photographers driven by the desire to freeze time. 
               We believe that every photograph should tell a story, evoke an emotion, and preserve a legacy.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
             <div className="relative">
                <img src="https://picsum.photos/seed/photog1/600/800" alt="Photographer 1" className="w-full h-full object-cover rounded-lg shadow-lg" />
                <div className="absolute bottom-8 left-8 bg-white p-6 shadow-xl max-w-xs">
                   <h3 className="font-heading font-bold text-xl text-black">Alex Morgan</h3>
                   <p className="text-gray-500 text-sm">Lead Photographer</p>
                </div>
             </div>
             <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-heading font-bold mb-6">The Visionary</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  With over 10 years of experience in fashion and editorial photography, Alex brings a keen eye for composition 
                  and lighting to every shoot. His philosophy is simple: perfection lies in the imperfections of candid moments.
                </p>
                <img src="https://picsum.photos/seed/camera1/400/300" alt="Camera Gear" className="w-full rounded-lg opacity-80" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:flex-row-reverse">
             <div className="flex flex-col justify-center order-2 md:order-1">
                <h3 className="text-3xl font-heading font-bold mb-6">The Storyteller</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sarah creates the narrative. Her background in photojournalism allows her to anticipate moments before they happen.
                  She ensures that the emotions of the day are documented authentically.
                </p>
             </div>
             <div className="relative order-1 md:order-2">
                <img src="https://picsum.photos/seed/photog2/600/800" alt="Photographer 2" className="w-full h-full object-cover rounded-lg shadow-lg" />
                <div className="absolute bottom-8 right-8 bg-white p-6 shadow-xl max-w-xs text-right">
                   <h3 className="font-heading font-bold text-xl text-black">Sarah Jenkins</h3>
                   <p className="text-gray-500 text-sm">Creative Director</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export const Destinations: React.FC = () => {
  const { destinations } = useApp();
  return (
    <div className="pt-32 pb-24 bg-gray-50 dark:bg-[#111] min-h-screen">
       <div className="container mx-auto px-6">
          <h1 className="text-5xl font-heading font-bold text-center mb-16 text-text">Global Destinations</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {destinations.map(dest => (
                <div key={dest.id} className="group relative overflow-hidden rounded-xl h-[400px] cursor-pointer">
                   <img src={dest.imageUrl} alt={dest.city} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                   <div className="absolute bottom-0 left-0 p-8 text-white w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <MapPin size={16} />
                        <span className="uppercase tracking-wider text-xs font-bold">{dest.country}</span>
                      </div>
                      <h2 className="text-3xl font-heading font-bold mb-2">{dest.city}</h2>
                      <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{dest.description}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export const Blog: React.FC = () => {
  const { blogPosts } = useApp();
  return (
    <div className="pt-32 pb-24 bg-surface text-text min-h-screen">
       <div className="container mx-auto px-6">
          <h1 className="text-5xl font-heading font-bold text-center mb-16">The Journal</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {blogPosts.map(post => (
                <article key={post.id} className="flex flex-col h-full bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                   <div className="h-64 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-wider">
                         <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                         <span className="flex items-center gap-1 text-primary font-bold">{post.category}</span>
                      </div>
                      <h2 className="text-2xl font-heading font-bold mb-4 hover:text-primary transition-colors cursor-pointer">{post.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-sm font-medium">
                            <User size={16} className="text-gray-400" /> {post.author}
                         </div>
                         <button className="text-primary text-sm font-bold uppercase tracking-wider hover:underline">Read More</button>
                      </div>
                   </div>
                </article>
             ))}
          </div>
       </div>
    </div>
  );
};

export const Contact: React.FC = () => {
   const { settings } = useApp();
   return (
     <div className="pt-32 pb-24 bg-surface text-text">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h1 className="text-5xl font-heading font-bold mb-8">Let's Create Together</h1>
                 <p className="text-xl text-gray-600 mb-12">
                    Ready to book your session or have questions about our international packages? 
                    Fill out the form and we'll get back to you within 24 hours.
                 </p>
                 
                 <div className="space-y-8">
                    <div className="flex items-start gap-4">
                       <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"><MapPin className="text-primary" /></div>
                       <div>
                          <h4 className="font-bold text-lg mb-1">Studio Location</h4>
                          <p className="text-gray-500">{settings.contactAddress}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"><Instagram className="text-primary" /></div>
                       <div>
                          <h4 className="font-bold text-lg mb-1">Follow Us</h4>
                          <p className="text-gray-500">@the2manstudio</p>
                       </div>
                    </div>
                 </div>
              </div>

              <form className="bg-gray-50 dark:bg-[#1a1a1a] p-8 md:p-12 rounded-xl shadow-lg" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                       <label className="block text-sm font-bold mb-2 uppercase tracking-wide">First Name</label>
                       <input type="text" className="w-full bg-surface border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Last Name</label>
                       <input type="text" className="w-full bg-surface border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                 </div>
                 <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Email Address</label>
                    <input type="email" className="w-full bg-surface border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                 </div>
                 <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Service Type</label>
                    <select className="w-full bg-surface border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors">
                       <option>Wedding Photography</option>
                       <option>Pre-Wedding</option>
                       <option>Fashion/Editorial</option>
                       <option>Maternity</option>
                       <option>Other</option>
                    </select>
                 </div>
                 <div className="mb-8">
                    <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Message</label>
                    <textarea rows={4} className="w-full bg-surface border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:border-primary transition-colors"></textarea>
                 </div>
                 <button className="w-full bg-primary text-white font-bold py-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    SEND MESSAGE <Send size={18} />
                 </button>
              </form>
           </div>
        </div>
     </div>
   );
};