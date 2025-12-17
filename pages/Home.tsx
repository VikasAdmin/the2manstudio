import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { services, settings, blogPosts } = useApp();
  const featuredServices = services.slice(0, 3);
  const recentPosts = blogPosts.slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://picsum.photos/seed/hero/1920/1080")', filter: 'brightness(0.6)' }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <p className="text-lg md:text-xl uppercase tracking-[0.2em] mb-4 opacity-90 animate-slide-up">International Photography</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {settings.siteName}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto opacity-90 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {settings.tagline}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="bg-white text-black px-8 py-4 font-bold tracking-wider hover:bg-gray-200 transition-colors">
              BOOK A SESSION
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-8 py-4 font-bold tracking-wider hover:bg-white hover:text-black transition-colors">
              VIEW PORTFOLIO
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-surface text-text">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Visual Storytellers for the Modern Era</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Based globally, we specialize in capturing the raw, authentic emotions that define your most important moments. 
            From the intimate whispers of a pre-wedding shoot to the grandeur of an international event, 
            The 2 Man Studio brings a cinematic touch to photography.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest hover:underline">
            Read Our Story <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text mb-4">Our Expertise</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map(service => (
              <Link key={service.id} to="/services" className="group block overflow-hidden relative h-[500px]">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <p className="text-xs uppercase tracking-widest mb-2 opacity-80">{service.category}</p>
                  <h3 className="text-2xl font-heading font-bold mb-4 group-hover:-translate-y-2 transition-transform duration-300">{service.title}</h3>
                  <span className="inline-flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    EXPLORE <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section className="py-24 bg-surface text-text relative">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-6">Destination Photography</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Love knows no borders, and neither do we. Whether it's a romantic getaway in Paris, 
                a traditional ceremony in Kyoto, or an elopement in Iceland, we travel the world to 
                frame your memories against the most breathtaking backdrops.
              </p>
              <Link to="/destinations" className="bg-primary text-white px-8 py-3 inline-block font-bold hover:opacity-90 transition-opacity">
                VIEW DESTINATIONS
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://picsum.photos/seed/d1/400/500" alt="Destination 1" className="w-full h-64 object-cover rounded-sm mt-8" />
               <img src="https://picsum.photos/seed/d2/400/500" alt="Destination 2" className="w-full h-64 object-cover rounded-sm" />
            </div>
         </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-24 bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
           <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-heading font-bold text-text">Latest Stories</h2>
              <Link to="/blog" className="text-primary font-bold hover:underline">View All Posts</Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {recentPosts.map(post => (
                <div key={post.id} className="group">
                   <div className="overflow-hidden mb-6 h-64 md:h-80">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   </div>
                   <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{post.category} • {post.date}</p>
                   <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                   <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;