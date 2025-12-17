import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { Service } from '../types';

const ServiceGalleryCarousel: React.FC<{ service: Service }> = ({ service }) => {
    const images = service.gallery && service.gallery.length > 0 ? service.gallery : [service.imageUrl];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (images.length <= 1) {
        return (
             <div className="relative group overflow-hidden rounded-lg shadow-xl h-[400px]">
                <img src={images[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
             </div>
        );
    }

    return (
        <div className="relative group overflow-hidden rounded-lg shadow-xl h-[400px]">
            <img src={images[currentIndex]} alt={`${service.title} - ${currentIndex + 1}`} className="w-full h-full object-cover transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            
            <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} 
                    />
                ))}
            </div>
        </div>
    );
};

const BookingModal: React.FC<{ service: Service; onClose: () => void }> = ({ service, onClose }) => {
    const { settings } = useApp();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all"
                >
                    <X size={20} />
                </button>
                
                <div className="p-8 text-center">
                    <h3 className="text-2xl font-heading font-bold mb-2 text-text">Book Session</h3>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs mb-8">{service.title}</p>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
                        We'd love to capture this for you. Choose your preferred method to connect with us instantly.
                    </p>
                    
                    <div className="space-y-4">
                        <a 
                            href={`tel:${settings.contactPhone}`}
                            className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-primary">
                                    <Phone size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Call Us</p>
                                    <p className="text-sm font-bold text-text">{settings.contactPhone}</p>
                                </div>
                            </div>
                        </a>
                        
                        <a 
                            href={`mailto:${settings.contactEmail}?subject=Inquiry for ${service.title}`}
                            className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg transition-all group"
                        >
                             <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-primary">
                                    <Mail size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Email Us</p>
                                    <p className="text-sm font-bold text-text">{settings.contactEmail}</p>
                                </div>
                            </div>
                        </a>
                        
                        {settings.socialLinks.whatsapp && (
                            <a 
                                href={settings.socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <MessageCircle size={20} className="fill-current" />
                                <span className="font-bold tracking-wide">Chat on WhatsApp</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Services: React.FC = () => {
  const { services } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [bookingService, setBookingService] = useState<Service | null>(null);
  
  const categories = ['All', 'Pre-Wedding', 'Wedding', 'Pre-Baby', 'Photoshoot', 'Jewelry', 'Cloths', 'Birthday'];

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="pt-32 pb-24 bg-surface min-h-screen relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-6">Our Services</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Comprehensive photography solutions tailored to your unique needs, from intimate portraits to grand celebrations.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider border transition-colors ${
                activeCategory === cat 
                ? 'bg-primary text-white border-primary' 
                : 'bg-transparent text-gray-500 border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-24">
          {filteredServices.map((service, index) => (
            <div key={service.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="w-full md:w-1/2">
                <ServiceGalleryCarousel service={service} />
              </div>
              
              <div className="w-full md:w-1/2">
                <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">{service.category}</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-text">{service.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mb-8">
                  <h4 className="font-bold text-text mb-4 uppercase text-sm tracking-wide">What's Included</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <span className="bg-primary/10 text-primary p-1 rounded-full"><Check size={14} /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => setBookingService(service)}
                  className="bg-primary text-white px-8 py-3 font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book This Service
                </button>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
             <div className="text-center text-gray-400 py-12">No services found in this category.</div>
          )}
        </div>
      </div>
      
      {bookingService && <BookingModal service={bookingService} onClose={() => setBookingService(null)} />}
    </div>
  );
};

export default Services;